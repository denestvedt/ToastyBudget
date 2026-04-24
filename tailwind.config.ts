import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent:    "var(--accent)",
        "accent-2":"var(--accent-2)",
        good:      "var(--good)",
        warn:      "var(--warn)",
        bad:       "var(--bad)",
        surface:   "var(--surface)",
        "surface-2":"var(--surface-2)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        pill:   "var(--r-pill)",
        input:  "var(--r-input)",
        button: "var(--r-button)",
        card:   "var(--r-card)",
        hero:   "var(--r-hero)",
      },
    },
  },
  plugins: [],
};
export default config;
