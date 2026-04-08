"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const cryptoCurrencies = [
  { ticker: "USDT", name: "Tether" },
  { ticker: "BTC", name: "Bitcoin" },
  { ticker: "ETH", name: "Ethereum" },
];

const fiatCurrencies = [
  { ticker: "USD", name: "US Dollar" },
  { ticker: "EUR", name: "Euro" },
  { ticker: "AMD", name: "Armenian Dram" },
  { ticker: "GBP", name: "British Pound" },
];

interface CryptoBadgeProps {
  ticker: string;
  name: string;
  index: number;
  isVisible: boolean;
}

function CryptoBadge({ ticker, name, index, isVisible }: CryptoBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex items-center gap-2"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-sm border border-gray-100">
        <span className="font-bold text-forest-primary">{ticker}</span>
        <span className="text-sm text-gray-400">{name}</span>
      </div>
    </motion.div>
  );
}

interface FiatBadgeProps {
  ticker: string;
  name: string;
  index: number;
  isVisible: boolean;
}

function FiatBadge({ ticker, name, index, isVisible }: FiatBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
      className="flex items-center justify-end gap-2"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-sm border border-gray-100">
        <span className="text-sm text-gray-400">{name}</span>
        <span className="font-bold text-forest-primary">{ticker}</span>
      </div>
    </motion.div>
  );
}

function AdexHub({ isVisible }: { isVisible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative flex items-center justify-center"
    >
      {/* Outer pulsing glow rings */}
      <motion.div
        className="absolute w-28 h-28 rounded-full border-2 border-forest-accent/30"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-28 h-28 rounded-full border border-forest-light/20"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.05, 0.2],
        }}
        transition={{
          duration: 3,
          delay: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main hub circle */}
      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-forest-primary to-forest-medium flex items-center justify-center shadow-lg shadow-forest-primary/20">
        {/* Inner glow */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-forest-accent/20 to-transparent" />
        <span className="relative font-display text-white text-lg tracking-wide">
          ADE<span className="text-forest-light">X</span>
        </span>
      </div>
    </motion.div>
  );
}

function FlowPaths({ isVisible }: { isVisible: boolean }) {
  // Path definitions for crypto (left) to center
  const leftPaths = [
    "M 0 60 Q 80 60, 160 130",   // USDT to center
    "M 0 130 Q 80 130, 160 130", // BTC to center
    "M 0 200 Q 80 200, 160 130", // ETH to center
  ];

  // Path definitions for center to fiat (right)
  const rightPaths = [
    "M 160 130 Q 240 45, 320 45",   // center to USD
    "M 160 130 Q 240 100, 320 105", // center to EUR
    "M 160 130 Q 240 160, 320 165", // center to AMD
    "M 160 130 Q 240 215, 320 215", // center to GBP
  ];

  return (
    <svg
      viewBox="0 0 320 260"
      className="absolute inset-0 w-full h-full"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Glow filter for dots */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient for paths */}
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2a8a55" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#3da96a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a8a55" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Left paths (crypto to hub) */}
      {leftPaths.map((d, index) => (
        <g key={`left-${index}`}>
          <motion.path
            d={d}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isVisible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
          />
          {isVisible && (
            <motion.circle
              r="4"
              fill="#3da96a"
              filter="url(#glow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2.5,
                delay: 0.8 + index * 0.4,
                repeat: Infinity,
                repeatDelay: 1.5,
              }}
            >
              <animateMotion
                dur="2.5s"
                repeatCount="indefinite"
                begin={`${0.8 + index * 0.4}s`}
                path={d}
              />
            </motion.circle>
          )}
        </g>
      ))}

      {/* Right paths (hub to fiat) */}
      {rightPaths.map((d, index) => (
        <g key={`right-${index}`}>
          <motion.path
            d={d}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isVisible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 + index * 0.15 }}
          />
          {isVisible && (
            <motion.circle
              r="4"
              fill="#2a8a55"
              filter="url(#glow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2.5,
                delay: 1.2 + index * 0.35,
                repeat: Infinity,
                repeatDelay: 1.5,
              }}
            >
              <animateMotion
                dur="2.5s"
                repeatCount="indefinite"
                begin={`${1.2 + index * 0.35}s`}
                path={d}
              />
            </motion.circle>
          )}
        </g>
      ))}
    </svg>
  );
}

function MobileFlow({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Crypto badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {cryptoCurrencies.map((crypto) => (
          <div
            key={crypto.ticker}
            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-full shadow-sm border border-gray-100"
          >
            <span className="font-bold text-sm text-forest-primary">{crypto.ticker}</span>
            <span className="text-xs text-gray-400">{crypto.name}</span>
          </div>
        ))}
      </motion.div>

      {/* Animated lines down */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative h-16 w-px bg-gradient-to-b from-forest-accent/30 to-forest-accent/50"
      >
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-forest-accent"
          style={{ boxShadow: "0 0 10px #2a8a55" }}
          animate={{ y: [0, 56, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ADEX Hub */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-forest-accent/30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "100%", height: "100%" }}
        />
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-forest-primary to-forest-medium flex items-center justify-center shadow-lg shadow-forest-primary/20">
          <span className="font-display text-white text-sm">
            ADE<span className="text-forest-light">X</span>
          </span>
        </div>
      </motion.div>

      {/* Animated lines down */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative h-16 w-px bg-gradient-to-b from-forest-accent/50 to-forest-accent/30"
      >
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-forest-light"
          style={{ boxShadow: "0 0 10px #3da96a" }}
          animate={{ y: [0, 56, 0] }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Fiat badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {fiatCurrencies.map((fiat) => (
          <div
            key={fiat.ticker}
            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-full shadow-sm border border-gray-100"
          >
            <span className="text-xs text-gray-400">{fiat.name}</span>
            <span className="font-bold text-sm text-forest-primary">{fiat.ticker}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function MoneyFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section ref={sectionRef} className="pt-16 sm:pt-20 pb-12 sm:pb-14 bg-cream overflow-hidden">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-forest-accent font-medium mb-3">
            Liquidity Infrastructure
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-forest-primary">
            Seamless On/Off Ramp
          </h2>
        </motion.div>

        {/* Desktop Hub-and-Spoke Layout */}
        <div className="hidden md:block">
          <div className="relative" style={{ height: "260px" }}>
            {/* SVG Flow Paths */}
            <FlowPaths isVisible={isInView} />

            {/* Three Column Layout */}
            <div className="relative z-10 h-full flex items-stretch justify-between">
              {/* Left: Crypto Column */}
              <div className="flex flex-col justify-between py-4">
                {cryptoCurrencies.map((crypto, index) => (
                  <CryptoBadge
                    key={crypto.ticker}
                    ticker={crypto.ticker}
                    name={crypto.name}
                    index={index}
                    isVisible={isInView}
                  />
                ))}
              </div>

              {/* Center: ADEX Hub */}
              <div className="flex items-center justify-center">
                <AdexHub isVisible={isInView} />
              </div>

              {/* Right: Fiat Column */}
              <div className="flex flex-col justify-between py-0">
                {fiatCurrencies.map((fiat, index) => (
                  <FiatBadge
                    key={fiat.ticker}
                    ticker={fiat.ticker}
                    name={fiat.name}
                    index={index}
                    isVisible={isInView}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <MobileFlow isVisible={isInView} />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-gray-600 max-w-[600px] mx-auto mt-10 sm:mt-12 leading-relaxed"
        >
          Convert between cryptocurrencies and fiat currencies with institutional-grade
          liquidity. Fast settlement, competitive rates, and full regulatory compliance.
        </motion.p>
      </div>
    </section>
  );
}
