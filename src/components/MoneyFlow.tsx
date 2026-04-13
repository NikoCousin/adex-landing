"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const GREEN = "#1B3D2F";
const LINE = "rgba(27,61,47,0.13)";
const DOT = "#2DD4BF";

// ─── Shared sub-components ────────────────────────────────────────────────────

function Pill({ label, cx, cy, pw, ph }: {
  label: string; cx: number; cy: number; pw: number; ph: number;
}) {
  return (
    <g>
      <rect
        x={cx - pw / 2} y={cy - ph / 2}
        width={pw} height={ph} rx={ph / 2}
        fill="white" stroke={GREEN} strokeOpacity={0.26} strokeWidth={1.2}
      />
      <text
        x={cx} y={cy}
        textAnchor="middle" dominantBaseline="middle"
        fill={GREEN} fontSize={11.5} fontFamily="Inter,sans-serif" fontWeight={600}
        style={{ letterSpacing: "0.07em" }}
      >
        {label}
      </text>
    </g>
  );
}

function Hub({ cx, cy, r, fs }: { cx: number; cy: number; r: number; fs: number }) {
  return (
    <g>
      {/* Soft radial glow */}
      <circle cx={cx} cy={cy} r={r + 80} fill="url(#hubGlow)" />

      {/* Concentric pulse rings */}
      <circle cx={cx} cy={cy} r={r + 30} fill="none" stroke={GREEN} strokeOpacity={0.06} strokeWidth={1} />
      <circle cx={cx} cy={cy} r={r + 58} fill="none" stroke={GREEN} strokeOpacity={0.04} strokeWidth={1} />
      <circle cx={cx} cy={cy} r={r + 90} fill="none" stroke={GREEN} strokeOpacity={0.025} strokeWidth={1} />

      {/* Hub circles */}
      <circle cx={cx} cy={cy} r={r + 16} fill={GREEN} fillOpacity={0.05} />
      <circle cx={cx} cy={cy} r={r + 8}  fill={GREEN} fillOpacity={0.08} />
      <circle cx={cx} cy={cy} r={r}       fill={GREEN} />

      {/* Label */}
      <text
        x={cx} y={cy}
        textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize={fs} fontFamily="Inter,sans-serif" fontWeight={700}
        style={{ letterSpacing: "0.12em" }}
      >
        ADEX
      </text>
    </g>
  );
}

interface DotDef { path: string; dur: number; begin: number; reverse?: boolean }

function Dot({ path, dur, begin, reverse = false }: DotDef) {
  const base = { path, dur: `${dur}s`, begin: `${begin}s`, repeatCount: "indefinite", calcMode: "linear" };
  const aProps = reverse ? { ...base, keyPoints: "1;0", keyTimes: "0;1" } : base;
  return (
    <>
      <circle r={5.5} fill={DOT} fillOpacity={0.18}>
        <animateMotion {...(aProps as any)} />
      </circle>
      <circle r={2.6} fill={DOT}>
        <animateMotion {...(aProps as any)} />
      </circle>
    </>
  );
}

// ─── Desktop diagram — 760 × 390, scaled up with 5 crypto + 6 fiat ───────────

const DW = 760, DH = 390;
const DHX = 380, DHY = 192, DHR = 62;
const DLX = 86,  DRX = 674, DPW = 92, DPH = 34;

const D_CRYPTO = [
  { label: "USDT", y: 60  },
  { label: "BTC",  y: 125 },
  { label: "ETH",  y: 192 },
  { label: "SOL",  y: 259 },
  { label: "USDC", y: 324 },
];

const D_FIAT = [
  { label: "USD",  y: 53  },
  { label: "EUR",  y: 108 },
  { label: "AMD",  y: 163 },
  { label: "GBP",  y: 218 },
  { label: "AED",  y: 273 },
  { label: "CHF",  y: 328 },
];

function dlPath(y: number) {
  const x0 = DLX + DPW / 2, x1 = DHX - DHR, mx = Math.round((x0 + x1) / 2);
  return `M ${x0} ${y} C ${mx} ${y} ${mx} ${DHY} ${x1} ${DHY}`;
}
function drPath(y: number) {
  const x0 = DHX + DHR, x1 = DRX - DPW / 2, mx = Math.round((x0 + x1) / 2);
  return `M ${x0} ${DHY} C ${mx} ${DHY} ${mx} ${y} ${x1} ${y}`;
}

function buildDesktopDots(): DotDef[] {
  const out: DotDef[] = [];

  D_CRYPTO.forEach(({ y }, i) => {
    const p = dlPath(y), d = 2.1 + i * 0.2;
    // 3 evenly-spaced dots per line
    out.push({ path: p, dur: d, begin: i * 0.42 });
    out.push({ path: p, dur: d, begin: i * 0.42 + d / 3 });
    out.push({ path: p, dur: d, begin: i * 0.42 + d * 2 / 3 });
    // occasional reverse dot for visual interest
    if (i % 2 === 0) out.push({ path: p, dur: d + 0.9, begin: i * 0.32 + 0.55, reverse: true });
  });

  D_FIAT.forEach(({ y }, i) => {
    const p = drPath(y), d = 2.2 + i * 0.17;
    out.push({ path: p, dur: d, begin: i * 0.36 + 0.1 });
    out.push({ path: p, dur: d, begin: i * 0.36 + 0.1 + d / 3 });
    out.push({ path: p, dur: d, begin: i * 0.36 + 0.1 + d * 2 / 3 });
    if (i % 2 === 1) out.push({ path: p, dur: d + 0.8, begin: i * 0.28 + 0.85, reverse: true });
  });

  return out;
}

function DesktopDiagram() {
  const dots = buildDesktopDots();
  return (
    <svg
      viewBox={`0 0 ${DW} ${DH}`}
      width="100%"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={GREEN} stopOpacity={0.16} />
          <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Section labels */}
      <text x={DLX} y={28} textAnchor="middle" fill={GREEN} fillOpacity={0.28}
        fontSize={9.5} fontFamily="Inter,sans-serif" fontWeight={500}
        style={{ letterSpacing: "0.22em" }}>CRYPTO</text>
      <text x={DRX} y={28} textAnchor="middle" fill={GREEN} fillOpacity={0.28}
        fontSize={9.5} fontFamily="Inter,sans-serif" fontWeight={500}
        style={{ letterSpacing: "0.22em" }}>FIAT</text>

      {/* Connection lines */}
      {D_CRYPTO.map(({ y }) => (
        <path key={`cl-${y}`} d={dlPath(y)} fill="none" stroke={LINE} strokeWidth={1.0} />
      ))}
      {D_FIAT.map(({ y }) => (
        <path key={`fl-${y}`} d={drPath(y)} fill="none" stroke={LINE} strokeWidth={1.0} />
      ))}

      {/* Hub (draws its own glow + rings inside) */}
      <Hub cx={DHX} cy={DHY} r={DHR} fs={13} />

      {/* Currency pills */}
      {D_CRYPTO.map(({ label, y }) => (
        <Pill key={label} label={label} cx={DLX} cy={y} pw={DPW} ph={DPH} />
      ))}
      {D_FIAT.map(({ label, y }) => (
        <Pill key={label} label={label} cx={DRX} cy={y} pw={DPW} ph={DPH} />
      ))}

      {/* Animated dots */}
      {dots.map((d, i) => <Dot key={i} {...d} />)}
    </svg>
  );
}

// ─── Mobile diagram — 260 × 500, vertical ────────────────────────────────────

const MW = 260, MH = 500;
const MHX = 130, MHY = 242, MHR = 40;
const MPW = 82, MPH = 30;

const M_CRYPTO = [
  { label: "USDT", y: 48  },
  { label: "BTC",  y: 92  },
  { label: "ETH",  y: 136 },
  { label: "SOL",  y: 180 },
];
const M_FIAT = [
  { label: "USD",  y: 310 },
  { label: "EUR",  y: 354 },
  { label: "AMD",  y: 398 },
  { label: "GBP",  y: 442 },
  { label: "AED",  y: 486 },
];

function muPath(y: number) {
  const y0 = y + MPH / 2, y1 = MHY - MHR, cp = Math.round((y0 + y1) / 2);
  return `M ${MHX} ${y0} C ${MHX} ${cp} ${MHX} ${cp} ${MHX} ${y1}`;
}
function mdPath(y: number) {
  const y0 = MHY + MHR, y1 = y - MPH / 2, cp = Math.round((y0 + y1) / 2);
  return `M ${MHX} ${y0} C ${MHX} ${cp} ${MHX} ${cp} ${MHX} ${y1}`;
}

function buildMobileDots(): DotDef[] {
  const out: DotDef[] = [];
  M_CRYPTO.forEach(({ y }, i) => {
    const p = muPath(y), d = 2.0 + i * 0.22;
    out.push({ path: p, dur: d, begin: i * 0.4 });
    out.push({ path: p, dur: d, begin: i * 0.4 + d / 2 });
  });
  M_FIAT.forEach(({ y }, i) => {
    const p = mdPath(y), d = 2.1 + i * 0.2;
    out.push({ path: p, dur: d, begin: i * 0.38 + 0.2 });
    out.push({ path: p, dur: d, begin: i * 0.38 + 0.2 + d / 2 });
    if (i % 2 === 0) out.push({ path: p, dur: d + 0.6, begin: i * 0.32 + 0.7, reverse: true });
  });
  return out;
}

function MobileDiagram() {
  const dots = buildMobileDots();
  return (
    <svg
      viewBox={`0 0 ${MW} ${MH}`}
      width={MW} height={MH}
      style={{ maxWidth: "100%", overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="mHubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={GREEN} stopOpacity={0.14} />
          <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
        </radialGradient>
      </defs>

      <text x={MHX} y={20} textAnchor="middle" fill={GREEN} fillOpacity={0.28}
        fontSize={9} fontFamily="Inter,sans-serif" fontWeight={500}
        style={{ letterSpacing: "0.20em" }}>CRYPTO</text>
      <text x={MHX} y={288} textAnchor="middle" fill={GREEN} fillOpacity={0.28}
        fontSize={9} fontFamily="Inter,sans-serif" fontWeight={500}
        style={{ letterSpacing: "0.20em" }}>FIAT</text>

      {M_CRYPTO.map(({ y }) => (
        <path key={`mu-${y}`} d={muPath(y)} fill="none" stroke={LINE} strokeWidth={1.0} />
      ))}
      {M_FIAT.map(({ y }) => (
        <path key={`md-${y}`} d={mdPath(y)} fill="none" stroke={LINE} strokeWidth={1.0} />
      ))}

      {/* Hub with glow */}
      <circle cx={MHX} cy={MHY} r={MHR + 60} fill="url(#mHubGlow)" />
      <circle cx={MHX} cy={MHY} r={MHR + 28} fill="none" stroke={GREEN} strokeOpacity={0.055} strokeWidth={1} />
      <circle cx={MHX} cy={MHY} r={MHR + 54} fill="none" stroke={GREEN} strokeOpacity={0.03}  strokeWidth={1} />
      <circle cx={MHX} cy={MHY} r={MHR + 12} fill={GREEN} fillOpacity={0.05} />
      <circle cx={MHX} cy={MHY} r={MHR + 6}  fill={GREEN} fillOpacity={0.08} />
      <circle cx={MHX} cy={MHY} r={MHR}       fill={GREEN} />
      <text x={MHX} y={MHY} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize={12} fontFamily="Inter,sans-serif" fontWeight={700}
        style={{ letterSpacing: "0.12em" }}>ADEX</text>

      {M_CRYPTO.map(({ label, y }) => (
        <Pill key={label} label={label} cx={MHX} cy={y} pw={MPW} ph={MPH} />
      ))}
      {M_FIAT.map(({ label, y }) => (
        <Pill key={label} label={label} cx={MHX} cy={y} pw={MPW} ph={MPH} />
      ))}

      {dots.map((d, i) => <Dot key={i} {...d} />)}
    </svg>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { label: "Instant Settlement",   sub: "Trades clear within seconds" },
  { label: "50+ Supported Assets", sub: "Major crypto & fiat currencies" },
  { label: "Bank-grade Security",  sub: "Regulated & fully compliant" },
];

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
});

// ─── Section ──────────────────────────────────────────────────────────────────

export default function MoneyFlow() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="w-full relative overflow-hidden py-14 sm:py-16 lg:py-20"
      style={{ background: "#f7faf8", borderTop: "1px solid #eaf0ec" }}
    >
      {/* Faint radial glow shifted toward diagram */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 65% at 68% 50%, rgba(27,61,47,0.05) 0%, transparent 68%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-14 xl:gap-20">

          {/* ── LEFT: copy + stats ─────────────────────────────────────── */}
          <motion.div
            className="lg:w-[42%] flex-shrink-0"
            variants={fadeUp(0)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <p
              className="text-[11px] uppercase font-medium mb-4"
              style={{ color: "#7a9e8e", letterSpacing: "0.28em" }}
            >
              On / Off Ramp
            </p>

            <h2
              className="font-display leading-[1.08] mb-4"
              style={{ color: GREEN, fontSize: "clamp(26px, 3.2vw, 42px)" }}
            >
              Seamless Conversion
            </h2>

            <p
              className="text-[15px] leading-[1.7] mb-8"
              style={{ color: "#7a8a82", maxWidth: 340 }}
            >
              Convert between crypto and fiat seamlessly through ADEX
            </p>

            {/* Stats stacked with dividers */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(27,61,47,0.09)" }}
            >
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 px-5 py-4 bg-white"
                  style={{ borderTop: i === 0 ? "none" : "1px solid rgba(27,61,47,0.07)" }}
                >
                  <span
                    className="mt-[5px] flex-shrink-0 rounded-full"
                    style={{ width: 7, height: 7, background: GREEN, opacity: 0.55 }}
                  />
                  <div>
                    <p className="text-sm font-semibold mb-0.5" style={{ color: GREEN }}>
                      {s.label}
                    </p>
                    <p className="text-xs leading-snug" style={{ color: "#8a9e94" }}>
                      {s.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: diagram ─────────────────────────────────────────── */}
          <motion.div
            className="flex-1 flex items-center justify-center mt-10 lg:mt-0"
            variants={fadeUp(0.18)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <div className="hidden lg:block w-full">
              <DesktopDiagram />
            </div>
            <div className="lg:hidden">
              <MobileDiagram />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
