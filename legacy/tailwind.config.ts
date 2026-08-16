import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        kreis: {
          cream: "#FAF7F2",
          sand: "#F0E8DC",
          clay: "#C4714A",
          clayDark: "#A85A38",
          sage: "#6B8F71",
          sageLight: "#E8F0E9",
          ink: "#2C2825",
          muted: "#6B6560",
          border: "#E5DDD3",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
