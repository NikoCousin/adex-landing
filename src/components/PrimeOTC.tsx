"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const GREEN = "#1B3D2F";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
});

const FEATURES = [
  ["Large-volume execution", "Primary liquidity"],
  ["Reduced market impact", "Private settlement"],
  ["Tailored pricing",       "Tailored support"],
];

const ASSETS = [
  { symbol: "BTC",  label: "₿",  bg: "#F7931A", fg: "#fff" },
  { symbol: "ETH",  label: "◆",  bg: "#627EEA", fg: "#fff" },
  { symbol: "USDT", label: "₮",  bg: "#26A17B", fg: "#fff" },
  { symbol: "SOL",  label: "◎",  bg: "#9945FF", fg: "#fff" },
  { symbol: "AVAX", label: "A",  bg: "#E84142", fg: "#fff" },
  { symbol: "BNB",  label: "B",  bg: "#F3BA2F", fg: "#fff" },
  { symbol: "USD",  label: "$",  bg: "#4C8C5E", fg: "#fff" },
  { symbol: "EUR",  label: "€",  bg: "#3B6FA0", fg: "#fff" },
  { symbol: "GBP",  label: "£",  bg: "#6B4FA0", fg: "#fff" },
];

export default function PrimeOTC() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="w-full bg-white py-12 sm:py-16 lg:py-20"
      style={{ borderTop: "1px solid #f0f0f0" }}
    >
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col items-center">

        {/* Eyebrow */}
        <motion.p
          variants={fadeUp(0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-[11px] uppercase font-medium mb-4 text-center"
          style={{ color: "#7a9e8e", letterSpacing: "0.28em" }}
        >
          OTC Desk
        </motion.p>

        {/* Title */}
        <motion.h2
          variants={fadeUp(0.08)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="font-display text-center leading-[1.1] mb-5"
          style={{ color: GREEN, fontSize: "clamp(26px, 3.8vw, 44px)", maxWidth: 580 }}
        >
          Prime OTC Desk for Prime Clients
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp(0.16)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center text-[15px] leading-[1.75] mb-12"
          style={{ color: "#7a8a82", maxWidth: 620 }}
        >
          Designed for larger transactions and higher expectations, our OTC desk
          provides a more private and efficient way to execute digital asset trades.
          Clients benefit from tailored pricing, direct handling, and a smoother
          settlement experience without the noise of public markets.
        </motion.p>

        {/* Feature pills — 2-col grid */}
        <motion.div
          variants={fadeUp(0.24)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 gap-2.5 w-full mb-12"
          style={{ maxWidth: 480 }}
        >
          {FEATURES.map((row, ri) =>
            row.map((label, ci) => (
              <div
                key={`${ri}-${ci}`}
                className="flex items-center justify-center px-5 py-2.5 text-xs font-semibold text-center"
                style={{
                  color: GREEN,
                  border: `1px solid rgba(27,61,47,0.22)`,
                  borderRadius: 99,
                  letterSpacing: "0.04em",
                  background: "white",
                }}
              >
                {label}
              </div>
            ))
          )}
        </motion.div>

        {/* Asset badge grid */}
        <motion.div
          variants={fadeUp(0.32)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-12"
        >
          <p
            className="text-center text-[10px] uppercase font-medium mb-4"
            style={{ color: "#aabfb5", letterSpacing: "0.22em" }}
          >
            Supported Assets
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-9 gap-3 justify-items-center">
            {ASSETS.map(({ symbol, label, bg, fg }) => (
              <div key={symbol} className="flex flex-col items-center gap-1.5">
                <div
                  className="flex items-center justify-center rounded-full text-xs font-bold select-none"
                  style={{
                    width: 36, height: 36,
                    background: bg,
                    color: fg,
                    fontSize: 14,
                    opacity: 0.82,
                  }}
                >
                  {label}
                </div>
                <span
                  className="text-[9px] font-medium tracking-wide"
                  style={{ color: "#aabfb5" }}
                >
                  {symbol}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp(0.40)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            style={{ background: GREEN, borderRadius: 8 }}
          >
            Quote Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
