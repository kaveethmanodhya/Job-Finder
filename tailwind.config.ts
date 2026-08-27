import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        bg: "#08050f",
        panel: "#110d1e",
        "panel-2": "#1a1430",
        violet: {
          DEFAULT: "#A855F7",
          dim: "#7C3AED",
          light: "#C084FC",
        },
        cyan: {
          DEFAULT: "#06B6D4",
          light: "#67E8F9",
        },
        pink: {
          DEFAULT: "#EC4899",
        },
        muted: "#8B93A7",
      },
      animation: {
        "ping-slow": "ping 2.4s cubic-bezier(0,0,0.2,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
