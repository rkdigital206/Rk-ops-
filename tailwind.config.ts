import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B1220",
        royal: "#2563EB",
        cyan: { DEFAULT: "#22D3EE" },
      },
      fontFamily: {
        heading: ["'Manrope Variable'", "system-ui", "sans-serif"],
        sans: ["'Inter Variable'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
