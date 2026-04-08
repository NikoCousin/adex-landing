"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const cryptoPrices = [
  { ticker: "TON", name: "Toncoin", price: "$1.222", color: "#0098EA" },
  { ticker: "BTC", name: "Bitcoin", price: "$66,634", color: "#F7931A" },
  { ticker: "SOL", name: "Solana", price: "$80.56", color: "#9945FF" },
  { ticker: "SUI", name: "Sui", price: "$0.8584", color: "#6FBCF0" },
];

const fxPairs = [
  {
    pair: "USDT-RUB",
    name: "Tether",
    rate: "81.8",
    flag: "🇷🇺",
    colors: ["#FFFFFF", "#0039A6", "#D52B1E"],
  },
  {
    pair: "USDT-BYN",
    name: "Tether",
    rate: "3.0387",
    flag: "🇧🇾",
    colors: ["#C8313E", "#4AA657"],
  },
  {
    pair: "USDT-EUR",
    name: "Tether",
    rate: "0.8853",
    flag: "🇪🇺",
    colors: ["#003399", "#FFCC00"],
  },
  {
    pair: "USDT-USD",
    name: "Tether",
    rate: "1.0076",
    flag: "🇺🇸",
    colors: ["#B22234", "#3C3B6E"],
  },
];

function CryptoCard({
  ticker,
  name,
  price,
  color,
  index,
  isVisible,
}: {
  ticker: string;
  name: string;
  price: string;
  color: string;
  index: number;
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      className="relative flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 min-w-[160px] overflow-hidden group"
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{ translateX: ["-100%", "100%"] }}
        transition={{
          duration: 3,
          delay: index * 0.5,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "easeInOut",
        }}
      />

      {/* Icon */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: color }}
      >
        {ticker.charAt(0)}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">{ticker}</span>
          <span className="text-white/50 text-xs">{name}</span>
        </div>
        <p className="text-white font-bold text-lg">{price}</p>
      </div>
    </motion.div>
  );
}

function FXRow({
  pair,
  name,
  rate,
  flag,
  colors,
  index,
  isVisible,
  isLast,
}: {
  pair: string;
  name: string;
  rate: string;
  flag: string;
  colors: string[];
  index: number;
  isVisible: boolean;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
      className={`relative flex items-center justify-between py-4 px-4 sm:px-6 ${
        !isLast ? "border-b border-white/10" : ""
      } overflow-hidden group`}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{ translateX: ["-100%", "100%"] }}
        transition={{
          duration: 3,
          delay: 1 + index * 0.4,
          repeat: Infinity,
          repeatDelay: 6,
          ease: "easeInOut",
        }}
      />

      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Flag circle */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors[0]} 50%, ${colors[1] || colors[0]} 50%)`,
          }}
        >
          <span className="text-lg">{flag}</span>
        </div>

        {/* Pair info */}
        <div>
          <p className="text-white font-semibold text-sm sm:text-base">{pair}</p>
          <p className="text-white/40 text-xs">USDT</p>
        </div>
      </div>

      {/* Middle */}
      <p className="text-white/60 text-sm hidden sm:block">{name}</p>

      {/* Right side - Rate */}
      <p className="text-white font-bold text-base sm:text-lg">{rate}</p>
    </motion.div>
  );
}

export default function Brokerage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Part - Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm uppercase tracking-[0.2em] text-forest-accent font-medium mb-4"
          >
            Crypto Brokerage
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl text-forest-primary mb-6"
          >
            Fast and Secure Brokerage Service
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-[600px] mx-auto mb-8 leading-relaxed"
          >
            Buy and sell digital assets through a professional, streamlined process
            designed for clarity, speed, and dependable execution.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-forest-primary text-forest-primary rounded-full font-medium transition-all duration-300 hover:bg-forest-primary hover:text-white"
            >
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* Bottom Part - Dark Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-[900px] mx-auto bg-[#0f1923] rounded-2xl overflow-hidden"
        >
          {/* Crypto Price Feed Row */}
          <div className="p-4 sm:p-6 bg-white/[0.02] border-b border-white/10">
            <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide sm:grid sm:grid-cols-4 sm:gap-4">
              {cryptoPrices.map((crypto, index) => (
                <CryptoCard
                  key={crypto.ticker}
                  {...crypto}
                  index={index}
                  isVisible={isInView}
                />
              ))}
            </div>
          </div>

          {/* FX Price Feed Table */}
          <div>
            {fxPairs.map((fx, index) => (
              <FXRow
                key={fx.pair}
                {...fx}
                index={index}
                isVisible={isInView}
                isLast={index === fxPairs.length - 1}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center pt-8"
        >
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-forest-accent font-medium hover:text-forest-primary transition-colors duration-300 group"
          >
            Open Brokerage Account
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
