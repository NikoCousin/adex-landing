import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1a5c38",
          primary: "#1a5c38",
          medium: "#1e6b41",
          accent: "#2a8a55",
          light: "#3da96a",
        },
        cream: {
          DEFAULT: "#faf9f6",
        },
      },
      fontFamily: {
        display: ["var(--font-dm-serif)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-slow": "marquee 35s linear infinite",
        scroll: "scroll 35s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
