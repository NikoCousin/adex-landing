"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// Generate procedural candlestick data with upward bias
function generateCandleData(count: number) {
  const candles = [];
  let basePrice = 22000;

  for (let i = 0; i < count; i++) {
    const isBullish = Math.random() < 0.8; // 80% green candles
    const volatility = 800 + Math.random() * 1500;
    const trend = 400 + Math.random() * 600; // Upward bias

    const open = basePrice + (Math.random() - 0.5) * volatility * 0.3;
    const close = isBullish
      ? open + Math.random() * volatility * 0.6 + trend * 0.3
      : open - Math.random() * volatility * 0.4;

    const high = Math.max(open, close) + Math.random() * volatility * 0.3;
    const low = Math.min(open, close) - Math.random() * volatility * 0.3;

    candles.push({
      open,
      high,
      low,
      close,
      isBullish: close > open,
    });

    basePrice = close + trend * 0.15;
  }

  return candles;
}

function CandlestickChart({ isVisible }: { isVisible: boolean }) {
  const candles = useMemo(() => generateCandleData(48), []);

  const chartWidth = 800;
  const chartHeight = 280;
  const padding = { top: 20, right: 40, bottom: 30, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate price range
  const allPrices = candles.flatMap((c) => [c.high, c.low]);
  const minPrice = 20000;
  const maxPrice = 60000;
  const priceRange = maxPrice - minPrice;

  // Scale functions
  const xScale = (index: number) =>
    padding.left + (index / (candles.length - 1)) * innerWidth;
  const yScale = (price: number) =>
    padding.top + (1 - (price - minPrice) / priceRange) * innerHeight;

  const candleWidth = innerWidth / candles.length - 2;

  // Generate area path for gradient fill
  const areaPath = useMemo(() => {
    let path = `M ${xScale(0)} ${yScale(candles[0].close)}`;
    candles.forEach((candle, i) => {
      path += ` L ${xScale(i)} ${yScale(candle.close)}`;
    });
    path += ` L ${xScale(candles.length - 1)} ${yScale(minPrice)}`;
    path += ` L ${xScale(0)} ${yScale(minPrice)} Z`;
    return path;
  }, [candles]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const priceLabels = ["$20k", "$30k", "$40k", "$50k", "$60k"];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full min-w-[600px]"
        style={{ height: "280px" }}
      >
        <defs>
          {/* Gradient for area fill */}
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a8a55" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2a8a55" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {priceLabels.map((_, i) => {
          const y = padding.top + (i / (priceLabels.length - 1)) * innerHeight;
          return (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={chartWidth - padding.right}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Candles */}
        {candles.map((candle, i) => {
          const x = xScale(i);
          const openY = yScale(candle.open);
          const closeY = yScale(candle.close);
          const highY = yScale(candle.high);
          const lowY = yScale(candle.low);
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.abs(closeY - openY);
          const color = candle.isBullish ? "#2a8a55" : "#dc2626";

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={
                isVisible
                  ? { opacity: 1, scaleY: 1 }
                  : { opacity: 0, scaleY: 0 }
              }
              transition={{
                duration: 0.4,
                delay: 0.3 + i * 0.015,
                ease: "easeOut",
              }}
              style={{ transformOrigin: `${x}px ${yScale(minPrice)}px` }}
            >
              {/* Wick */}
              <line
                x1={x}
                y1={highY}
                x2={x}
                y2={lowY}
                stroke={color}
                strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={Math.max(bodyHeight, 1)}
                fill={color}
                rx="1"
              />
            </motion.g>
          );
        })}

        {/* Y-axis labels */}
        {priceLabels.map((label, i) => {
          const y = padding.top + (i / (priceLabels.length - 1)) * innerHeight;
          return (
            <text
              key={label}
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              className="text-[10px] fill-gray-400"
            >
              {label}
            </text>
          );
        })}

        {/* X-axis labels */}
        {months.map((month, i) => {
          const x = padding.left + (i / (months.length - 1)) * innerWidth;
          return (
            <text
              key={month}
              x={x}
              y={chartHeight - 8}
              textAnchor="middle"
              className="text-[10px] fill-gray-400"
            >
              {month}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function SparkLine() {
  const points = "0,20 10,18 20,22 30,15 40,17 50,12 60,14 70,8 80,10 90,5 100,7";

  return (
    <svg viewBox="0 0 100 25" className="w-16 h-6">
      <polyline
        points={points}
        fill="none"
        stroke="#2a8a55"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({
  label,
  value,
  badge,
  valueColor = "text-gray-900",
  delay = 0,
  isVisible,
}: {
  label: string;
  value: string;
  badge?: string;
  valueColor?: string;
  delay?: number;
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="flex-1 min-w-[140px]"
    >
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <p className={`text-xl sm:text-2xl font-bold ${valueColor}`}>{value}</p>
        {badge && (
          <span className="px-2 py-0.5 bg-forest-accent/10 text-forest-accent text-xs font-medium rounded-full">
            {badge}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function Advisory() {
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
            Advisory
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl text-forest-primary mb-6"
          >
            Strategic Guidance, Tailored to Your Goals.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-[600px] mx-auto mb-8 leading-relaxed"
          >
            We help define the right approach to digital asset exposure, treasury
            positioning, and long-term portfolio logic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-forest-primary text-forest-primary rounded-full font-medium transition-all duration-300 hover:bg-forest-primary hover:text-white"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Mockup Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-[900px] mx-auto rounded-2xl overflow-hidden shadow-xl shadow-black/10"
        >
          {/* Window Frame Bar */}
          <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>

          {/* Dashboard Content */}
          <div className="bg-white p-4 sm:p-8">
            {/* Stats Row */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mb-8 pb-6 border-b border-gray-100">
              <StatCard
                label="Total Value"
                value="$55,314"
                badge="+105.98%"
                valueColor="text-forest-accent"
                delay={0.4}
                isVisible={isInView}
              />
              <StatCard
                label="Cost Basis"
                value="$26,854"
                delay={0.5}
                isVisible={isInView}
              />
              <StatCard
                label="Unrealized Gains"
                value="$28,459"
                valueColor="text-forest-accent"
                delay={0.6}
                isVisible={isInView}
              />

              {/* Mini Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex-1 min-w-[140px] flex flex-col items-end sm:border-l sm:border-gray-100 sm:pl-6"
              >
                <div className="flex items-center gap-3 mb-1">
                  <SparkLine />
                  <span className="text-xs text-gray-500">128 transactions</span>
                </div>
                <a
                  href="#"
                  className="text-xs font-medium text-forest-accent hover:text-forest-primary transition-colors"
                >
                  BREAKDOWN →
                </a>
              </motion.div>
            </div>

            {/* Chart Area */}
            <CandlestickChart isVisible={isInView} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
