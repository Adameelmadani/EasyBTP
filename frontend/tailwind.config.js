/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefdf3",
          100: "#d6f9e2",
          200: "#aff2c8",
          300: "#79e6a6",
          400: "#3fd07f",
          500: "#16b563",
          600: "#0a9350",
          700: "#0a7543",
          800: "#0c5d39",
          900: "#0b4c30",
        },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
        display: ["Quantify", "Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(16, 90, 60, 0.12)",
        "glass-sm": "0 4px 16px 0 rgba(16, 90, 60, 0.08)",
        glow: "0 0 0 1px rgba(22,181,99,0.2), 0 8px 30px rgba(22,181,99,0.15)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        "slide-in": { from: { opacity: 0, transform: "translateX(-12px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
