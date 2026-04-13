"use client";

import { useEffect, useRef } from "react";

const C_GREEN: [number, number, number] = [27, 61, 47];
const C_TEAL: [number, number, number] = [45, 212, 191];

interface GridPoint { sx: number; sy: number; }

type NodePhase = "fadein" | "hold" | "fadeout";
interface LiveNode {
  id: number;
  gridIdx: number;
  isAccent: boolean;
  phase: NodePhase;
  phaseStart: number;
  fadeInDur: number;
  holdDur: number;
  fadeOutDur: number;
  opacity: number;
}

interface LiveEdge {
  nodeIdA: number;
  nodeIdB: number;
  opacity: number;
}

interface Packet {
  nodeIdA: number;
  nodeIdB: number;
  t: number;
  speed: number;
  dir: 1 | -1;
}

interface DrawInEdge {
  a: number;
  b: number;
  delay: number;
  progress: number;
  baseOpacity: number;
}

// Use a plain object record instead of Map to avoid downlevelIteration issues
type NodeRecord = Record<number, LiveNode>;

interface State {
  grid: GridPoint[];
  leftCut: number;
  occupied: Set<number>;
  liveNodes: NodeRecord;
  liveNodeCount: number;
  liveEdges: LiveEdge[];
  packets: Packet[];
  drawInEdges: DrawInEdge[];
  drawInDone: boolean;
  nextId: number;
  lastSpawn: number;
  W: number;
  H: number;
}

const MAX_CONNECT_DIST = 130;
const MAX_LIVE = 14;
const SPAWN_INTERVAL = 450;

function dist(a: GridPoint, b: GridPoint) {
  return Math.hypot(a.sx - b.sx, a.sy - b.sy);
}

function buildGrid(W: number, H: number) {
  const isMobile = W < 768;
  const COLS = isMobile ? 9 : 12;
  const ROWS = isMobile ? 7 : 9;
  const cellW = isMobile
    ? Math.max(Math.min(W * 0.09, 38), 24)
    : Math.min(W * 0.062, 62);
  const cellH = cellW * 0.52;

  const originX = isMobile ? W * 0.58 : W * 0.68;
  const originY = isMobile ? H * 0.08 : H * 0.08;
  const leftCut = isMobile ? W * 0.04 : W * 0.30;

  const grid: GridPoint[] = [];
  const indexMap: Record<string, number> = {};

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      const sx = originX + (col - row) * cellW;
      const sy = originY + (col + row) * cellH;
      if (sx < leftCut || sx > W * 1.10 || sy < -H * 0.06 || sy > H * 1.10) continue;
      indexMap[`${col},${row}`] = grid.length;
      grid.push({ sx, sy });
    }
  }

  const edgeSet = new Set<string>();
  const drawInEdges: DrawInEdge[] = [];

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      const aIdx = indexMap[`${col},${row}`];
      if (aIdx === undefined) continue;
      const neighbours: [number, number][] = [
        [col + 1, row],
        [col, row + 1],
        [col + 1, row + 1],
      ];
      for (const [nc, nr] of neighbours) {
        const bIdx = indexMap[`${nc},${nr}`];
        if (bIdx === undefined) continue;
        const key = aIdx < bIdx ? `${aIdx}-${bIdx}` : `${bIdx}-${aIdx}`;
        if (edgeSet.has(key)) continue;
        edgeSet.add(key);
        const distFactor = (grid[aIdx].sx - leftCut) / (W - leftCut);
        const delay = 150 + (1 - distFactor) * 900 + Math.random() * 350;
        drawInEdges.push({ a: aIdx, b: bIdx, delay, progress: 0, baseOpacity: 0.15 + Math.random() * 0.08 });
      }
    }
  }

  return { grid, leftCut, drawInEdges };
}

function initState(W: number, H: number): State {
  const { grid, leftCut, drawInEdges } = buildGrid(W, H);
  return {
    grid, leftCut,
    occupied: new Set(),
    liveNodes: {},
    liveNodeCount: 0,
    liveEdges: [],
    packets: [],
    drawInEdges,
    drawInDone: false,
    nextId: 1,
    lastSpawn: 0,
    W, H,
  };
}

function spawnNode(state: State, now: number): void {
  if (state.liveNodeCount >= MAX_LIVE) return;
  const available: number[] = [];
  for (let i = 0; i < state.grid.length; i++) {
    if (!state.occupied.has(i)) available.push(i);
  }
  if (available.length === 0) return;

  const gridIdx = available[Math.floor(Math.random() * available.length)];
  const id = state.nextId++;
  state.occupied.add(gridIdx);
  state.liveNodes[id] = {
    id, gridIdx,
    isAccent: Math.random() < 0.18,
    phase: "fadein",
    phaseStart: now,
    fadeInDur: 300 + Math.random() * 250,
    holdDur: 1400 + Math.random() * 1600,
    fadeOutDur: 450 + Math.random() * 300,
    opacity: 0,
  };
  state.liveNodeCount++;
  state.lastSpawn = now;

  const pt = state.grid[gridIdx];
  const ids = Object.keys(state.liveNodes);
  for (let k = 0; k < ids.length; k++) {
    const other = state.liveNodes[Number(ids[k])];
    if (other.id === id) continue;
    const otherPt = state.grid[other.gridIdx];
    if (dist(pt, otherPt) <= MAX_CONNECT_DIST) {
      state.liveEdges.push({ nodeIdA: id, nodeIdB: other.id, opacity: 0 });
    }
  }
}

function tickNodes(state: State, now: number): void {
  const dead: number[] = [];
  const ids = Object.keys(state.liveNodes);

  for (let k = 0; k < ids.length; k++) {
    const node = state.liveNodes[Number(ids[k])];
    const age = now - node.phaseStart;

    if (node.phase === "fadein") {
      node.opacity = Math.min(1, age / node.fadeInDur);
      if (age >= node.fadeInDur) { node.phase = "hold"; node.phaseStart = now; node.opacity = 1; }
    } else if (node.phase === "hold") {
      node.opacity = 0.85 + 0.15 * Math.sin((now * 0.001) * 1.2 + node.id * 0.7);
      if (age >= node.holdDur) { node.phase = "fadeout"; node.phaseStart = now; }
    } else {
      node.opacity = Math.max(0, 1 - age / node.fadeOutDur);
      if (node.opacity <= 0) dead.push(node.id);
    }
  }

  for (let d = 0; d < dead.length; d++) {
    const id = dead[d];
    state.occupied.delete(state.liveNodes[id].gridIdx);
    delete state.liveNodes[id];
    state.liveNodeCount--;
    state.liveEdges = state.liveEdges.filter((e) => e.nodeIdA !== id && e.nodeIdB !== id);
    state.packets = state.packets.filter((p) => p.nodeIdA !== id && p.nodeIdB !== id);
  }
}

function tickEdges(state: State): void {
  for (let i = 0; i < state.liveEdges.length; i++) {
    const edge = state.liveEdges[i];
    const na = state.liveNodes[edge.nodeIdA];
    const nb = state.liveNodes[edge.nodeIdB];
    if (!na || !nb) continue;
    edge.opacity = Math.min(na.opacity, nb.opacity) * 0.55;
  }
  state.liveEdges = state.liveEdges.filter(
    (e) => state.liveNodes[e.nodeIdA] && state.liveNodes[e.nodeIdB]
  );
}

function tickPackets(state: State): void {
  if (state.packets.length < 8 && Math.random() < 0.012) {
    const candidates = state.liveEdges.filter((e) => e.opacity > 0.15);
    if (candidates.length > 0) {
      const edge = candidates[Math.floor(Math.random() * candidates.length)];
      state.packets.push({
        nodeIdA: edge.nodeIdA, nodeIdB: edge.nodeIdB,
        t: Math.random(),
        speed: 0.00010 + Math.random() * 0.00008,
        dir: Math.random() > 0.5 ? 1 : -1,
      });
    }
  }
  state.packets = state.packets.filter((p) => {
    const alive = state.liveEdges.some(
      (e) => (e.nodeIdA === p.nodeIdA && e.nodeIdB === p.nodeIdB) ||
              (e.nodeIdA === p.nodeIdB && e.nodeIdB === p.nodeIdA)
    );
    if (!alive) return false;
    p.t += p.speed * p.dir;
    if (p.t > 1) p.t = 0;
    if (p.t < 0) p.t = 1;
    return true;
  });
}

export default function NetworkMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId = 0;
    let startTime: number | null = null;
    let state: State | null = null;

    const getSize = () => {
      const p = canvas.parentElement;
      if (!p) return { W: 800, H: 600 };
      const r = p.getBoundingClientRect();
      return { W: r.width, H: r.height };
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { W, H } = getSize();
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      startTime = null;
      state = initState(W, H);
    };

    const frame = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;

      const dpr = window.devicePixelRatio || 1;
      const { W, H } = getSize();
      const ctx = canvas.getContext("2d");
      if (!ctx || !state) { animId = requestAnimationFrame(frame); return; }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      // ── Phase 1: draw-in ──────────────────────────────────────────────────
      let allDrawn = true;
      for (let i = 0; i < state.drawInEdges.length; i++) {
        const e = state.drawInEdges[i];
        if (elapsed < e.delay) { allDrawn = false; continue; }
        e.progress = Math.min(1, (elapsed - e.delay) / 650);
        if (e.progress < 1) allDrawn = false;
        if (e.progress <= 0) continue;

        const na = state.grid[e.a];
        const nb = state.grid[e.b];
        ctx.beginPath();
        ctx.moveTo(na.sx, na.sy);
        ctx.lineTo(na.sx + (nb.sx - na.sx) * e.progress, na.sy + (nb.sy - na.sy) * e.progress);
        ctx.strokeStyle = `rgba(${C_GREEN[0]},${C_GREEN[1]},${C_GREEN[2]},${e.baseOpacity})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(na.sx, na.sy, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${C_GREEN[0]},${C_GREEN[1]},${C_GREEN[2]},0.28)`;
        ctx.fill();
      }

      if (!state.drawInDone && allDrawn && elapsed > 800) state.drawInDone = true;

      // ── Ghost scaffold (after draw-in) ────────────────────────────────────
      if (state.drawInDone) {
        for (let i = 0; i < state.drawInEdges.length; i++) {
          const e = state.drawInEdges[i];
          if (e.progress < 1) continue;
          const na = state.grid[e.a]; const nb = state.grid[e.b];
          ctx.beginPath();
          ctx.moveTo(na.sx, na.sy);
          ctx.lineTo(nb.sx, nb.sy);
          ctx.strokeStyle = `rgba(${C_GREEN[0]},${C_GREEN[1]},${C_GREEN[2]},0.08)`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
        for (let i = 0; i < state.grid.length; i++) {
          const pt = state.grid[i];
          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, 1.1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${C_GREEN[0]},${C_GREEN[1]},${C_GREEN[2]},0.10)`;
          ctx.fill();
        }
      }

      // ── Phase 2: living network ───────────────────────────────────────────
      if (elapsed > 1800) {
        tickNodes(state, ts);
        tickEdges(state);
        tickPackets(state);
        if (ts - state.lastSpawn > SPAWN_INTERVAL) spawnNode(state, ts);

        // Live edges
        for (let i = 0; i < state.liveEdges.length; i++) {
          const edge = state.liveEdges[i];
          if (edge.opacity <= 0.01) continue;
          const na = state.liveNodes[edge.nodeIdA];
          const nb = state.liveNodes[edge.nodeIdB];
          if (!na || !nb) continue;
          const ptA = state.grid[na.gridIdx]; const ptB = state.grid[nb.gridIdx];
          ctx.beginPath();
          ctx.moveTo(ptA.sx, ptA.sy);
          ctx.lineTo(ptB.sx, ptB.sy);
          ctx.strokeStyle = `rgba(${C_GREEN[0]},${C_GREEN[1]},${C_GREEN[2]},${edge.opacity})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }

        // Live nodes
        const nodeIds = Object.keys(state.liveNodes);
        for (let k = 0; k < nodeIds.length; k++) {
          const node = state.liveNodes[Number(nodeIds[k])];
          if (node.opacity <= 0.01) continue;
          const pt = state.grid[node.gridIdx];
          const op = node.opacity;

          if (node.isAccent) {
            const g = ctx.createRadialGradient(pt.sx, pt.sy, 0, pt.sx, pt.sy, 12);
            g.addColorStop(0, `rgba(${C_TEAL[0]},${C_TEAL[1]},${C_TEAL[2]},${0.45 * op})`);
            g.addColorStop(1, `rgba(${C_TEAL[0]},${C_TEAL[1]},${C_TEAL[2]},0)`);
            ctx.beginPath(); ctx.arc(pt.sx, pt.sy, 12, 0, Math.PI * 2);
            ctx.fillStyle = g; ctx.fill();
            ctx.beginPath(); ctx.arc(pt.sx, pt.sy, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${C_TEAL[0]},${C_TEAL[1]},${C_TEAL[2]},${0.85 * op})`; ctx.fill();
          } else {
            const g = ctx.createRadialGradient(pt.sx, pt.sy, 0, pt.sx, pt.sy, 8);
            g.addColorStop(0, `rgba(${C_GREEN[0]},${C_GREEN[1]},${C_GREEN[2]},${0.28 * op})`);
            g.addColorStop(1, `rgba(${C_GREEN[0]},${C_GREEN[1]},${C_GREEN[2]},0)`);
            ctx.beginPath(); ctx.arc(pt.sx, pt.sy, 8, 0, Math.PI * 2);
            ctx.fillStyle = g; ctx.fill();
            ctx.beginPath(); ctx.arc(pt.sx, pt.sy, 2.0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${C_GREEN[0]},${C_GREEN[1]},${C_GREEN[2]},${0.70 * op})`; ctx.fill();
          }
        }

        // Data packets
        for (let i = 0; i < state.packets.length; i++) {
          const pkt = state.packets[i];
          const na = state.liveNodes[pkt.nodeIdA];
          const nb = state.liveNodes[pkt.nodeIdB];
          if (!na || !nb) continue;
          const ptA = state.grid[na.gridIdx]; const ptB = state.grid[nb.gridIdx];
          const px = ptA.sx + (ptB.sx - ptA.sx) * pkt.t;
          const py = ptA.sy + (ptB.sy - ptA.sy) * pkt.t;
          const edgeOp = Math.min(na.opacity, nb.opacity);

          const g = ctx.createRadialGradient(px, py, 0, px, py, 8);
          g.addColorStop(0, `rgba(${C_TEAL[0]},${C_TEAL[1]},${C_TEAL[2]},${0.80 * edgeOp})`);
          g.addColorStop(1, `rgba(${C_TEAL[0]},${C_TEAL[1]},${C_TEAL[2]},0)`);
          ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
          ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.90 * edgeOp})`; ctx.fill();
        }
      }

      // ── Left fade mask ────────────────────────────────────────────────────
      const fadeW = W * 0.50;
      const mask = ctx.createLinearGradient(0, 0, fadeW, 0);
      mask.addColorStop(0,    "rgba(255,255,255,1)");
      mask.addColorStop(0.50, "rgba(255,255,255,0.80)");
      mask.addColorStop(0.82, "rgba(255,255,255,0.12)");
      mask.addColorStop(1,    "rgba(255,255,255,0)");
      ctx.fillStyle = mask;
      ctx.fillRect(0, 0, fadeW, H);

      ctx.restore();
      animId = requestAnimationFrame(frame);
    };

    resize();
    animId = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-40 md:opacity-100"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
