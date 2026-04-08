"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const featureTags = [
  "Large-volume execution",
  "Primary liquidity",
  "Reduced market impact",
  "Private settlement",
  "Tailored pricing",
  "Tailored support",
];

const cryptoIcons = [
  { symbol: "A", name: "AVAX", color: "#E84142" },
  { symbol: "₿", name: "BTC", color: "#F7931A" },
  { symbol: "◆", name: "ETH", color: "#627EEA" },
  { symbol: "₳", name: "ADA", color: "#0033AD" },
  { symbol: "£", name: "GBP", color: "#C41E3A" },
  { symbol: "€", name: "EUR", color: "#2a8a55" },
  { symbol: "$", name: "USD", color: "#C9A227" },
  { symbol: "●", name: "DOT", color: "#E6007A" },
  { symbol: "⬡", name: "LINK", color: "#2A5ADA" },
  { symbol: "₮", name: "USDT", color: "#26A17B" },
];

function CryptoCard({
  symbol,
  name,
  color,
  index,
  isVisible,
}: {
  symbol: string;
  name: string;
  color: string;
  index: number;
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
      className="relative"
    >
      <motion.div
        animate={
          isVisible
            ? {
                y: [0, -6, 0],
              }
            : {}
        }
        transition={{
          duration: 3,
          delay: index * 0.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center group hover:shadow-md transition-shadow duration-300"
      >
        <span
          className="text-2xl sm:text-3xl font-bold transition-transform duration-300 group-hover:scale-110"
          style={{ color }}
        >
          {symbol}
        </span>
      </motion.div>
      <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2 font-medium">
        {name}
      </p>
    </motion.div>
  );
}

export default function PrimeOTC() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const tagVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div>
            <motion.p
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="text-xs sm:text-sm uppercase tracking-[0.2em] text-forest-accent font-medium mb-4"
            >
              Prime OTC Desk
            </motion.p>

            <motion.h2
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl text-forest-primary leading-tight mb-6"
            >
              Prime OTC Desk for Prime Clients
            </motion.h2>

            <motion.p
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.2 }}
              className="text-gray-600 leading-relaxed mb-8"
            >
              Designed for larger transactions and higher expectations, our OTC desk
              provides a more private and efficient way to execute digital asset
              trades. Clients benefit from tailored pricing, direct handling, and a
              smoother settlement experience without the noise of public markets.
            </motion.p>

            {/* Feature Tags Grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-2 gap-3 mb-8"
            >
              {featureTags.map((tag, index) => (
                <motion.div
                  key={index}
                  variants={tagVariants}
                  className="px-4 sm:px-5 py-2.5 border border-forest-accent/30 rounded-full text-sm font-medium text-forest-primary/80 text-center whitespace-nowrap"
                >
                  {tag}
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 px-8 py-4 bg-forest-primary text-white rounded-full font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-forest-primary/25 group"
              >
                Quote Now
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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

          {/* Right Column - Crypto Icons Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Row 1 - 3 items centered */}
              <div className="col-start-2 col-span-1">
                <CryptoCard {...cryptoIcons[0]} index={0} isVisible={isInView} />
              </div>
              <div className="col-span-1">
                <CryptoCard {...cryptoIcons[1]} index={1} isVisible={isInView} />
              </div>
              <div className="col-span-1">
                <CryptoCard {...cryptoIcons[2]} index={2} isVisible={isInView} />
              </div>

              {/* Row 2 - 4 items */}
              <div className="col-start-1 col-span-1">
                <CryptoCard {...cryptoIcons[3]} index={3} isVisible={isInView} />
              </div>
              <div className="col-span-1">
                <CryptoCard {...cryptoIcons[4]} index={4} isVisible={isInView} />
              </div>
              <div className="col-span-1">
                <CryptoCard {...cryptoIcons[5]} index={5} isVisible={isInView} />
              </div>
              <div className="col-span-1">
                <CryptoCard {...cryptoIcons[6]} index={6} isVisible={isInView} />
              </div>
              <div className="col-span-1" />

              {/* Row 3 - 3 items centered */}
              <div className="col-start-2 col-span-1">
                <CryptoCard {...cryptoIcons[7]} index={7} isVisible={isInView} />
              </div>
              <div className="col-span-1">
                <CryptoCard {...cryptoIcons[8]} index={8} isVisible={isInView} />
              </div>
              <div className="col-span-1">
                <CryptoCard {...cryptoIcons[9]} index={9} isVisible={isInView} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
