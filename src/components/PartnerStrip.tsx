"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const partners = [
  "Binance",
  "Kraken",
  "OKX",
  "Bybit",
  "Bitfinex",
  "Wintermute",
  "TXN",
  "Tether",
  "Circle",
  "Axiym",
  "AMBER",
  "CryptoPay",
];

function PartnerLogo({ name }: { name: string }) {
  return (
    <span className="flex-shrink-0 text-sm sm:text-lg uppercase font-bold tracking-[0.05em] text-gray-400 select-none whitespace-nowrap">
      {name}
    </span>
  );
}

export default function PartnerStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });

  return (
    <section ref={sectionRef} className="py-10 sm:py-14 bg-cream overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-10 px-4"
      >
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-forest-accent/70 font-medium mb-3">
          Our Partners
        </p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-forest-primary">
          Trusted by Leading Institutions
        </h2>
      </motion.div>

      {/* Marquee Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative group"
      >
        {/* Left Gradient Mask */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[60px] sm:w-[100px] z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #faf9f6 0%, #faf9f6 20%, transparent 100%)",
          }}
        />

        {/* Right Gradient Mask */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[60px] sm:w-[100px] z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, #faf9f6 0%, #faf9f6 20%, transparent 100%)",
          }}
        />

        {/* Overflow container */}
        <div className="overflow-hidden">
          {/* Single animated track containing both sets */}
          <div
            className="flex gap-10 sm:gap-[60px] w-max animate-scroll group-hover:[animation-play-state:paused]"
          >
            {/* First set */}
            {partners.map((partner, index) => (
              <PartnerLogo key={`first-${index}`} name={partner} />
            ))}
            {/* Duplicate set for seamless loop */}
            {partners.map((partner, index) => (
              <PartnerLogo key={`second-${index}`} name={partner} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
