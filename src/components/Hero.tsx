"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import NetworkMesh from "./NetworkMesh";

const GREEN = "#1B3D2F";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
});

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-white"
      style={{ minHeight: "100svh" }}
    >
      {/* Network mesh — canvas, right side */}
      <NetworkMesh />

      {/* ── Main layout ── */}
      <div className="relative z-10 flex flex-col min-h-[100svh]">

        {/* Spacer for fixed navbar (h-16 = 64px) */}
        <div className="h-16 flex-shrink-0" />

        {/* Content row */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 lg:py-24">
            {/*
              Left column: text content (~55% on desktop).
              On mobile, full-width stacked.
            */}
            <div className="max-w-xl lg:max-w-[580px]">

              {/* Eyebrow */}
              <motion.p
                variants={fadeUp(0.1)}
                initial="hidden"
                animate="visible"
                className="text-[11px] uppercase font-medium tracking-[0.28em] mb-6"
                style={{ color: "#888" }}
              >
                Secure &nbsp;·&nbsp; Institutional &nbsp;·&nbsp; Compliant
              </motion.p>

              {/* Headline */}
              <motion.h1
                variants={fadeUp(0.22)}
                initial="hidden"
                animate="visible"
                className="font-display leading-[1.08] mb-6"
                style={{ fontSize: "clamp(38px, 5.5vw, 68px)" }}
              >
                {/* First line — full green */}
                <span style={{ color: GREEN }}>Move Capital Into Crypto —</span>
                {/* Second line — fades to a lighter muted green (Stripe-style) */}
                <br />
                <span
                  style={{
                    background: `linear-gradient(90deg, ${GREEN} 0%, #6b9e80 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  With Precision
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                variants={fadeUp(0.34)}
                initial="hidden"
                animate="visible"
                className="text-base sm:text-[17px] leading-[1.7] mb-10"
                style={{ color: "#666", maxWidth: "480px" }}
              >
                Prime OTC desk for prime clients. Fast, secure crypto brokerage
                and tailored digital asset solutions for investors, businesses,
                and institutions.
              </motion.p>

              {/* CTA */}
              <motion.div
                variants={fadeUp(0.46)}
                initial="hidden"
                animate="visible"
              >
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90 hover:-translate-y-px"
                  style={{ background: GREEN }}
                >
                  Get Started
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
