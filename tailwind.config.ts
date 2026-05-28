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
        hr: {
          bg:        "#FAFAF8",
          warm:      "#F5F0E8",
          border:    "#E8E0D5",
          "border-soft": "#D4C5A9",
          dark:      "#1A1410",
          brown:     "#3A3028",
          muted:     "#7A6F64",
          hint:      "#9A8E82",
          promo:     "#8C4A30",
          success:   "#5A7A3A",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.3em",
      },
    },
  },
  plugins: [],
};

export default config;
