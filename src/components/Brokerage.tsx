"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const GREEN = "#1B3D2F";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
});

// ─── Animated number (counts up once in-view) ────────────────────────────────

function AnimatedPrice({ value, prefix = "", decimals = 2, active }: {
  value: number; prefix?: string; decimals?: number; active: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const duration = 900;
    const start = performance.now();
    const from = value * 0.88;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (value - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [active, value]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <span>{prefix}{formatted}</span>;
}

// ─── Crypto price tiles ───────────────────────────────────────────────────────

const CRYPTO_TILES = [
  { symbol: "TON",  letter: "T", bg: "#0098EA", price: 1.222,    dec: 3 },
  { symbol: "BTC",  letter: "₿", bg: "#F7931A", price: 66634,    dec: 0 },
  { symbol: "SOL",  letter: "◎", bg: "#9945FF", price: 80.56,    dec: 2 },
  { symbol: "SUI",  letter: "S", bg: "#4DA2FF", price: 0.8584,   dec: 4 },
];

function CryptoPriceFeed({ active }: { active: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
      {CRYPTO_TILES.map(({ symbol, letter, bg, price, dec }) => (
        <div key={symbol} className="flex flex-col gap-2 p-4" style={{ background: "#111827" }}>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-full text-white font-bold flex-shrink-0"
              style={{ width: 26, height: 26, background: bg, fontSize: 11 }}
            >
              {letter}
            </div>
            <span className="text-xs font-semibold" style={{ color: "#9CA3AF" }}>{symbol}</span>
          </div>
          <span className="text-sm font-semibold tabular-nums" style={{ color: "#F9FAFB" }}>
            $<AnimatedPrice value={price} decimals={dec} active={active} />
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── FX price feed ────────────────────────────────────────────────────────────

const FX_ROWS = [
  { pair: "USDT-RUB", label: "Tether", flag: "#D52B1E", flagLabel: "RU", rate: 81.80,   dec: 2 },
  { pair: "USDT-BYN", label: "Tether", flag: "#CF101A", flagLabel: "BY", rate: 3.0387,  dec: 4 },
  { pair: "USDT-EUR", label: "Tether", flag: "#003399", flagLabel: "EU", rate: 0.8853,  dec: 4 },
  { pair: "USDT-USD", label: "Tether", flag: "#3C3B6E", flagLabel: "US", rate: 1.0076,  dec: 4 },
];

function FxPriceFeed({ active }: { active: boolean }) {
  return (
    <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      {FX_ROWS.map(({ pair, label, flag, flagLabel, rate, dec }, i) => (
        <div
          key={pair}
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-full text-white flex-shrink-0"
              style={{ width: 28, height: 28, background: flag, fontSize: 8, fontWeight: 700, letterSpacing: "0.02em" }}
            >
              {flagLabel}
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "#F3F4F6", letterSpacing: "0.04em" }}>{pair}</p>
              <p className="text-[10px]" style={{ color: "#6B7280" }}>{label}</p>
            </div>
          </div>
          <span className="text-sm font-semibold tabular-nums" style={{ color: "#D1FAE5" }}>
            <AnimatedPrice value={rate} decimals={dec} active={active} />
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Mockup card ─────────────────────────────────────────────────────────────

function MockupCard({ active }: { active: boolean }) {
  const [tab, setTab] = useState<"crypto" | "fx">("crypto");

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: "#111827",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10)",
        maxWidth: 620,
      }}
    >
      {/* Card header bar */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#0F172A" }}
      >
        {/* Tab pills */}
        <div className="flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.05)", borderRadius: 99, padding: "3px" }}>
          {(["crypto", "fx"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="text-[9px] sm:text-[10px] font-semibold px-2.5 sm:px-3 py-1 transition-all duration-200 whitespace-nowrap"
              style={{
                borderRadius: 99,
                letterSpacing: "0.05em",
                background: tab === t ? GREEN : "transparent",
                color: tab === t ? "#fff" : "#6B7280",
              }}
            >
              <span className="sm:hidden">{t === "crypto" ? "Crypto" : "FX"}</span>
              <span className="hidden sm:inline">{t === "crypto" ? "Crypto price feed" : "FX price feed"}</span>
            </button>
          ))}
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <span className="block rounded-full" style={{ width: 6, height: 6, background: "#10B981" }} />
          <span className="text-[10px] font-medium" style={{ color: "#6B7280" }}>Live</span>
        </div>
      </div>

      {/* Price tiles */}
      <CryptoPriceFeed active={active} />

      {/* Divider + CTA */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <span className="text-[11px] font-medium" style={{ color: "#6B7280", letterSpacing: "0.06em" }}>
          {tab === "crypto" ? "LIVE RATES" : "FX RATES"}
        </span>
        <a
          href="#"
          className="text-[11px] font-semibold transition-opacity hover:opacity-80"
          style={{ color: "#6EE7B7", letterSpacing: "0.04em" }}
        >
          Get Started →
        </a>
      </div>

      {/* Feed content */}
      {tab === "crypto" ? (
        <div className="px-5 py-4">
          <p className="text-[10px] mb-3" style={{ color: "#4B5563", letterSpacing: "0.12em" }}>ALL PAIRS</p>
          <div className="space-y-0">
            {FX_ROWS.map(({ pair, label, flag, flagLabel, rate, dec }, i) => (
              <div
                key={pair}
                className="flex items-center justify-between py-2.5"
                style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center justify-center rounded-full text-white flex-shrink-0"
                    style={{ width: 24, height: 24, background: flag, fontSize: 7, fontWeight: 700 }}
                  >
                    {flagLabel}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold" style={{ color: "#E5E7EB" }}>{pair}</p>
                    <p className="text-[10px]" style={{ color: "#4B5563" }}>{label}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold tabular-nums" style={{ color: "#D1FAE5" }}>
                  <AnimatedPrice value={rate} decimals={dec} active={active} />
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <FxPriceFeed active={active} />
      )}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Brokerage() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="w-full bg-white py-12 sm:py-16 lg:py-20"
      style={{ borderTop: "1px solid #f0f0f0" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-10 flex flex-col items-center w-full">

        {/* Eyebrow */}
        <motion.p
          variants={fadeUp(0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-[11px] uppercase font-medium mb-4 text-center"
          style={{ color: "#7a9e8e", letterSpacing: "0.28em" }}
        >
          Brokerage
        </motion.p>

        {/* Title */}
        <motion.h2
          variants={fadeUp(0.08)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="font-display text-center leading-[1.1] mb-5"
          style={{ color: GREEN, fontSize: "clamp(26px, 3.8vw, 44px)", maxWidth: 540 }}
        >
          Fast and Secure Brokerage Service
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp(0.16)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center text-[15px] leading-[1.75] mb-12"
          style={{ color: "#7a8a82", maxWidth: 600 }}
        >
          Buy and sell digital assets through a professional, streamlined process
          designed for clarity, speed, and dependable execution.
        </motion.p>

        {/* Mockup card */}
        <motion.div
          variants={fadeUp(0.24)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="w-full flex justify-center mb-10"
        >
          <MockupCard active={inView} />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={fadeUp(0.32)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: GREEN }}
          >
            Open Brokerage Account
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
