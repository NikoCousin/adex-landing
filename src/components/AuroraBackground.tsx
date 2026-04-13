"use client";

// Pure CSS aurora — no canvas, no JS animation loop.
// Five overlapping blobs animate via keyframes defined in globals.css.
export default function AuroraBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Soft left-to-white fade — keeps text readable */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, #fff 20%, rgba(255,255,255,0.55) 48%, transparent 70%)",
        }}
      />

      {/* Aurora field — positioned right half */}
      <div className="absolute top-0 right-0 w-[70%] h-full">
        {/* Emerald green — largest blob */}
        <div
          className="aurora-blob-1 absolute rounded-full"
          style={{
            width: "70%",
            height: "80%",
            top: "-10%",
            left: "15%",
            background:
              "radial-gradient(ellipse at center, rgba(27,96,60,0.55) 0%, transparent 70%)",
            filter: "blur(72px)",
          }}
        />
        {/* Teal / cyan */}
        <div
          className="aurora-blob-2 absolute rounded-full"
          style={{
            width: "55%",
            height: "60%",
            top: "20%",
            right: "-5%",
            background:
              "radial-gradient(ellipse at center, rgba(20,168,138,0.40) 0%, transparent 68%)",
            filter: "blur(64px)",
          }}
        />
        {/* Mint — light highlight */}
        <div
          className="aurora-blob-3 absolute rounded-full"
          style={{
            width: "45%",
            height: "50%",
            top: "5%",
            right: "10%",
            background:
              "radial-gradient(ellipse at center, rgba(110,218,165,0.35) 0%, transparent 65%)",
            filter: "blur(56px)",
          }}
        />
        {/* Soft amber/peach — Stripe-style warm contrast blob */}
        <div
          className="aurora-blob-4 absolute rounded-full"
          style={{
            width: "40%",
            height: "45%",
            bottom: "5%",
            left: "5%",
            background:
              "radial-gradient(ellipse at center, rgba(220,170,100,0.28) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        {/* Deep forest — bottom-right anchor */}
        <div
          className="aurora-blob-5 absolute rounded-full"
          style={{
            width: "60%",
            height: "55%",
            bottom: "-15%",
            right: "-10%",
            background:
              "radial-gradient(ellipse at center, rgba(15,60,40,0.45) 0%, transparent 68%)",
            filter: "blur(72px)",
          }}
        />
      </div>

      {/* Bottom-right corner extra glow for depth */}
      <div
        className="absolute bottom-0 right-0 w-[40%] h-[40%]"
        style={{
          background:
            "radial-gradient(ellipse at bottom right, rgba(40,120,80,0.3) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />
    </div>
  );
}
