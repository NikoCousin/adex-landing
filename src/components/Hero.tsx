"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function TopographicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const lineCount = 40;
      const startY = height * 0.4; // Start at 40% from top (bottom 60%)
      const endY = height;
      const lineSpacing = (endY - startY) / lineCount;

      for (let i = 0; i < lineCount; i++) {
        const baseY = startY + i * lineSpacing;
        const opacity = 0.04 + (i / lineCount) * 0.11; // 0.04 to 0.15

        ctx.beginPath();
        ctx.strokeStyle = `rgba(26, 92, 56, ${opacity})`;
        ctx.lineWidth = 1;

        for (let x = 0; x <= width; x += 2) {
          // Multiple sine waves combined for organic look
          const wave1 = Math.sin((x * 0.003) + time * 0.3 + i * 0.3) * 15;
          const wave2 = Math.sin((x * 0.007) + time * 0.2 + i * 0.5) * 10;
          const wave3 = Math.sin((x * 0.002) + time * 0.4 + i * 0.2) * 20;

          const y = baseY + wave1 + wave2 + wave3;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      time += 0.008;
      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3"
    >
      <span className="text-[10px] uppercase tracking-[0.25em] text-forest-primary/60 font-medium">
        Scroll
      </span>
      <div className="relative w-px h-12 bg-forest-primary/20 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-3 bg-forest-primary/60 rounded-full"
          animate={{
            y: [0, 36, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="relative h-[100svh] md:h-screen w-full overflow-hidden bg-cream">
      {/* Topographic Wave Background */}
      <TopographicCanvas />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm uppercase tracking-[0.25em] text-forest-accent font-medium mb-6 sm:mb-8"
          >
            Secure · Institutional · Compliant
          </motion.p>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-forest-primary leading-[1.1] mb-6 sm:mb-8"
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
            }}
          >
            Move Capital Into Crypto — With Precision
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-gray-600 max-w-[640px] mx-auto mb-8 sm:mb-12 leading-relaxed"
          >
            Prime OTC desk for prime clients. Fast, secure crypto brokerage and
            tailored digital asset solutions for investors, businesses, and
            institutions.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-8 py-4 bg-forest-primary text-white rounded-full font-medium text-base sm:text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-forest-primary/25 group"
            >
              Get Started
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
        </motion.div>

        {/* Scroll Indicator */}
        <ScrollIndicator />
      </div>
    </section>
  );
}
