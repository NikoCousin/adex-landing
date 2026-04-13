"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const GREEN = "#1B3D2F";

// ─── Seeded PRNG (LCG) — stable data across renders ──────────────────────────

function lcg(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

// ─── Candle data ──────────────────────────────────────────────────────────────

interface Candle {
  open: number; close: number; high: number; low: number; vol: number; bull: boolean;
}

const CANDLES: Candle[] = (() => {
  const rng = lcg(0xc0ffee42);
  let price = 26500;
  const out: Candle[] = [];
  for (let i = 0; i < 46; i++) {
    // increasingly bullish bias as portfolio grows
    const bias = 0.52 + (i / 46) * 0.18;
    const bull = rng() < bias;
    const bodyPct = rng() * 0.026 + 0.006;
    const wickHi  = rng() * 0.016 + 0.003;
    const wickLo  = rng() * 0.013 + 0.002;
    const open = price;
    const body = open * bodyPct;
    const close = bull ? open + body : open - body;
    const high  = Math.max(open, close) + open * wickHi;
    const low   = Math.min(open, close) - open * wickLo;
    const vol   = rng() * 0.72 + 0.28;
    // net-upward drift
    price = close + (bull ? open * 0.0038 : -open * 0.0008);
    out.push({ open, close, high, low, vol, bull });
  }
  return out;
})();

// ─── Chart geometry constants ─────────────────────────────────────────────────

const CW = 700, CH = 260;
const PAD = { t: 14, r: 14, b: 40, l: 52 };
const VOL_H = 26;
const CANDLE_H = CH - PAD.t - PAD.b - VOL_H - 10;  // ~170
const PLOT_W   = CW - PAD.l - PAD.r;                 // ~634
const SLOT     = PLOT_W / CANDLES.length;
const BW       = Math.max(SLOT * 0.50, 5);           // candle body width

const P_MIN = Math.min(...CANDLES.map(c => c.low))  * 0.994;
const P_MAX = Math.max(...CANDLES.map(c => c.high)) * 1.006;
const P_RNG = P_MAX - P_MIN;

function pY(price: number) {
  return PAD.t + CANDLE_H - ((price - P_MIN) / P_RNG) * CANDLE_H;
}
function cX(i: number) {
  return PAD.l + i * SLOT + SLOT / 2;
}
function volTop(vol: number) {
  const areaTop = PAD.t + CANDLE_H + 10;
  return areaTop + VOL_H * (1 - vol);
}
function volBottom() {
  return PAD.t + CANDLE_H + 10 + VOL_H;
}

// Y-axis tick prices
const Y_TICKS = Array.from({ length: 5 }, (_, i) => {
  const price = P_MIN + (P_RNG / 4) * i;
  const label = price >= 1000
    ? `$${(price / 1000).toFixed(0)}k`
    : `$${Math.round(price)}`;
  return { y: pY(price), label };
});

// X-axis month labels
const X_LABELS = [
  { label: "Jan", i: 0  },
  { label: "Mar", i: 8  },
  { label: "May", i: 16 },
  { label: "Jul", i: 23 },
  { label: "Sep", i: 31 },
  { label: "Nov", i: 39 },
  { label: "Dec", i: 45 },
];

// ─── Animated count-up stat ───────────────────────────────────────────────────

function AnimatedStat({ value, prefix = "", active }: {
  value: number; prefix?: string; active: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const dur = 1200;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(value * e);
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [active, value]);

  return (
    <span>
      {prefix}
      {Math.round(display).toLocaleString("en-US")}
    </span>
  );
}

// ─── Mini bar spark (transactions) ───────────────────────────────────────────

const SPARK = [3, 5, 4, 7, 5, 8, 6, 9, 7, 8, 10, 9];

// ─── Candlestick chart ────────────────────────────────────────────────────────

function CandlestickChart({ active }: { active: boolean }) {
  const [revealW, setRevealW] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const dur = 2800;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setRevealW(e * PLOT_W);
      if (p < 1) requestAnimationFrame(tick);
      else setRevealW(PLOT_W);
    };
    requestAnimationFrame(tick);
  }, [active]);

  return (
    <svg
      viewBox={`0 0 ${CW} ${CH}`}
      width="100%"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="adv-chart-reveal">
          <rect x={PAD.l} y={0} width={revealW} height={CH} />
        </clipPath>
      </defs>

      {/* Y-axis grid lines + labels */}
      {Y_TICKS.map(({ y, label }, i) => (
        <g key={i}>
          <line
            x1={PAD.l} y1={y} x2={CW - PAD.r} y2={y}
            stroke="rgba(255,255,255,0.05)" strokeWidth={1}
          />
          <text
            x={PAD.l - 7} y={y}
            textAnchor="end" dominantBaseline="middle"
            fill="rgba(255,255,255,0.25)"
            fontSize={9} fontFamily="Inter,sans-serif"
          >
            {label}
          </text>
        </g>
      ))}

      {/* X-axis baseline */}
      <line
        x1={PAD.l} y1={CH - PAD.b}
        x2={CW - PAD.r} y2={CH - PAD.b}
        stroke="rgba(255,255,255,0.06)" strokeWidth={1}
      />

      {/* X-axis month labels */}
      {X_LABELS.map(({ label, i }) => (
        <text
          key={label}
          x={cX(i)} y={CH - PAD.b + 15}
          textAnchor="middle"
          fill="rgba(255,255,255,0.22)"
          fontSize={9} fontFamily="Inter,sans-serif"
        >
          {label}
        </text>
      ))}

      {/* Clipped candles + volume */}
      <g clipPath="url(#adv-chart-reveal)">

        {/* Volume bars */}
        {CANDLES.map((c, i) => {
          const x = cX(i);
          const yT = volTop(c.vol);
          const yB = volBottom();
          return (
            <rect
              key={`vol-${i}`}
              x={x - BW / 2} y={yT}
              width={BW} height={yB - yT}
              fill={c.bull ? "rgba(34,197,94,0.20)" : "rgba(239,68,68,0.16)"}
              rx={1}
            />
          );
        })}

        {/* Wicks */}
        {CANDLES.map((c, i) => (
          <line
            key={`wick-${i}`}
            x1={cX(i)} y1={pY(c.high)}
            x2={cX(i)} y2={pY(c.low)}
            stroke={c.bull ? "#22c55e" : "#ef4444"}
            strokeWidth={1}
            strokeOpacity={0.65}
          />
        ))}

        {/* Bodies */}
        {CANDLES.map((c, i) => {
          const x   = cX(i);
          const yT  = pY(Math.max(c.open, c.close));
          const yB  = pY(Math.min(c.open, c.close));
          const h   = Math.max(yB - yT, 1);
          return (
            <rect
              key={`body-${i}`}
              x={x - BW / 2} y={yT}
              width={BW} height={h}
              fill={c.bull ? "#22c55e" : "#ef4444"}
              fillOpacity={c.bull ? 0.90 : 0.80}
              rx={1}
            />
          );
        })}

      </g>
    </svg>
  );
}

// ─── Fade-up variants ─────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
});

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Advisory() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="w-full py-16 sm:py-20 lg:py-24"
      style={{ background: "#f7faf8", borderTop: "1px solid #eaf0ec" }}
    >
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col items-center">

        {/* Eyebrow */}
        <motion.p
          variants={fadeUp(0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-[11px] uppercase font-medium mb-4 text-center"
          style={{ color: "#7a9e8e", letterSpacing: "0.28em" }}
        >
          Advisory
        </motion.p>

        {/* Title */}
        <motion.h2
          variants={fadeUp(0.08)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="font-display text-center leading-[1.1] mb-5"
          style={{ color: GREEN, fontSize: "clamp(26px, 3.8vw, 46px)", maxWidth: 620 }}
        >
          Strategic Guidance, Tailored to Your Goals.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp(0.15)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center text-[15px] leading-[1.75] mb-8"
          style={{ color: "#7a8a82", maxWidth: 580 }}
        >
          We help define the right approach to digital asset exposure, treasury
          positioning, and long-term portfolio logic.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={fadeUp(0.22)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-lg transition-all duration-200"
            style={{
              color: GREEN,
              border: `1.5px solid ${GREEN}`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = GREEN;
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = GREEN;
            }}
          >
            Contact Us
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>

        {/* ── Dashboard card ─────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp(0.30)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="w-full rounded-2xl overflow-hidden"
          style={{
            background: "#111827",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.20), 0 4px 20px rgba(0,0,0,0.12)",
          }}
        >

          {/* Card header */}
          <div
            className="flex items-center justify-between px-5 sm:px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0F172A" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="block rounded-full"
                style={{ width: 6, height: 6, background: "#10B981" }}
              />
              <span
                className="text-[10px] font-semibold"
                style={{ color: "#9CA3AF", letterSpacing: "0.10em" }}
              >
                PORTFOLIO PERFORMANCE
              </span>
            </div>
            {/* Three-dot menu */}
            <div className="flex items-center gap-[3px] opacity-30">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="block rounded-full"
                  style={{ width: 3.5, height: 3.5, background: "#9CA3AF" }}
                />
              ))}
            </div>
          </div>

          {/* Stat blocks */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-px"
            style={{
              background: "rgba(255,255,255,0.045)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Total Value */}
            <div className="flex flex-col gap-1 px-5 py-4" style={{ background: "#111827" }}>
              <span
                className="text-[10px] font-medium uppercase"
                style={{ color: "#6B7280", letterSpacing: "0.08em" }}
              >
                Total Value
              </span>
              <span className="text-lg font-semibold tabular-nums" style={{ color: "#F9FAFB" }}>
                $<AnimatedStat value={55314} active={inView} />
              </span>
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="none" stroke="#22c55e" strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="text-[11px] font-semibold" style={{ color: "#22c55e" }}>
                  +105.98%
                </span>
              </div>
            </div>

            {/* Cost Basis */}
            <div className="flex flex-col gap-1 px-5 py-4" style={{ background: "#111827" }}>
              <span
                className="text-[10px] font-medium uppercase"
                style={{ color: "#6B7280", letterSpacing: "0.08em" }}
              >
                Cost Basis
              </span>
              <span className="text-lg font-semibold tabular-nums" style={{ color: "#F9FAFB" }}>
                $<AnimatedStat value={26854} active={inView} />
              </span>
              <span className="text-[10px]" style={{ color: "#4B5563" }}>
                Initial investment
              </span>
            </div>

            {/* Unrealized Gains */}
            <div className="flex flex-col gap-1 px-5 py-4" style={{ background: "#111827" }}>
              <span
                className="text-[10px] font-medium uppercase"
                style={{ color: "#6B7280", letterSpacing: "0.08em" }}
              >
                Unrealized Gains
              </span>
              <span className="text-lg font-semibold tabular-nums" style={{ color: "#22c55e" }}>
                +$<AnimatedStat value={28459} active={inView} />
              </span>
              <span className="text-[10px]" style={{ color: "#4B5563" }}>
                Across all positions
              </span>
            </div>

            {/* Transactions */}
            <div className="flex flex-col gap-1 px-5 py-4" style={{ background: "#111827" }}>
              <span
                className="text-[10px] font-medium uppercase"
                style={{ color: "#6B7280", letterSpacing: "0.08em" }}
              >
                Transactions
              </span>
              <span className="text-lg font-semibold tabular-nums" style={{ color: "#F9FAFB" }}>
                128
              </span>
              {/* Mini bar chart */}
              <div className="flex items-end gap-px" style={{ height: 16 }}>
                {SPARK.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${(h / 10) * 100}%`,
                      background: i >= SPARK.length - 4
                        ? "rgba(34,197,94,0.55)"
                        : "rgba(255,255,255,0.12)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Candlestick chart */}
          <div className="px-3 sm:px-5 pt-5 pb-2">
            <CandlestickChart active={inView} />
          </div>

          {/* Card footer */}
          <div
            className="flex items-center justify-between px-5 sm:px-6 py-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-[10px]" style={{ color: "#374151" }}>
              Performance data — illustrative only
            </span>
            <span
              className="text-[10px] font-semibold"
              style={{ color: "#4B5563", letterSpacing: "0.10em" }}
            >
              BREAKDOWN →
            </span>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
