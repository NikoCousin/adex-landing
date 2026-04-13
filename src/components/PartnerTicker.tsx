"use client";

const PARTNERS = [
  "BITFINEX",
  "USD₮0",
  "HACK VC",
  "FRANKLIN TEMPLETON",
  "BYBIT",
  "MIRANA",
  "SUSQUEHANNA CRYPTO",
];

// Separator between names
function Sep() {
  return (
    <span
      className="select-none"
      aria-hidden
      style={{ color: "#ddd", margin: "0 clamp(20px, 3.5vw, 52px)", fontSize: "18px", lineHeight: 1 }}
    >
      ·
    </span>
  );
}

export default function PartnerTicker() {
  // Triple so there's no gap at any viewport width
  const items = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section
      className="w-full bg-white overflow-hidden"
      style={{
        borderTop: "1px solid #f0f0f0",
        borderBottom: "1px solid #f0f0f0",
        padding: "28px 0",
      }}
      aria-label="Partner organisations"
    >
      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 h-full w-28 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #fff 30%, transparent)" }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 h-full w-28 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #fff 30%, transparent)" }}
        />

        <div
          className="ticker-track flex items-center whitespace-nowrap w-max"
        >
          {items.map((name, i) => (
            <span key={i} className="inline-flex items-center">
              <span
                className="select-none font-semibold tracking-[0.12em]"
                style={{
                  color: "#b0b0b0",
                  fontSize: "clamp(13px, 1.4vw, 17px)",
                  letterSpacing: "0.12em",
                }}
              >
                {name}
              </span>
              <Sep />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
