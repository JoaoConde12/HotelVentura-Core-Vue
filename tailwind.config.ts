import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#d4af37",
        "primary-light": "#f3e5ab",
        "background-dark": "#0a192f",
        "surface-dark": "#112240",
        "accent-blue": "#233554",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
} satisfies Config
