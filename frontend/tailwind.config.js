/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Vert (identité / accents)
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
        // Orange (call-to-action / highlights)
        accent: {
          50: "#fff4ec",
          100: "#ffe3d2",
          200: "#ffc3a3",
          300: "#ff9d6b",
          400: "#ff7e3e",
          500: "#ff6a1a",
          600: "#f15206",
          700: "#c84105",
          800: "#9c360b",
          900: "#7c2f0e",
        },
        // Noir / surfaces sombres
        ink: {
          950: "#050706",
          900: "#0a0d0b",
          800: "#0e1210",
          700: "#141815",
          600: "#1b201c",
          500: "#262d27",
        },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
        display: ["Quantify", "Inter", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(16, 90, 60, 0.10)",
        "glass-sm": "0 4px 16px 0 rgba(16, 90, 60, 0.08)",
        glow: "0 0 0 1px rgba(22,181,99,0.20), 0 8px 30px rgba(22,181,99,0.15)",
        "glow-green": "0 0 0 1px rgba(22,181,99,0.20), 0 8px 30px rgba(22,181,99,0.15)",
        "glow-accent": "0 0 0 1px rgba(255,106,26,0.22), 0 10px 30px -6px rgba(255,106,26,0.30)",
      },
      backdropBlur: { xs: "2px" },
      keyframes: {
        "fade-in": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        "slide-in": { from: { opacity: 0, transform: "translateX(-12px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        "float-lg": { "0%,100%": { transform: "translateY(0) rotate(0deg)" }, "50%": { transform: "translateY(-24px) rotate(2deg)" } },
        "spin-slow": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        "glow-pulse": { "0%,100%": { opacity: 0.45, transform: "scale(1)" }, "50%": { opacity: 0.85, transform: "scale(1.06)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        gridpan: { from: { backgroundPosition: "0 0" }, to: { backgroundPosition: "44px 44px" } },
        reveal: { from: { opacity: 0, transform: "translateY(24px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        dash: { to: { strokeDashoffset: 0 } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        float: "float 6s ease-in-out infinite",
        "float-lg": "float-lg 9s ease-in-out infinite",
        "spin-slow": "spin-slow 26s linear infinite",
        "glow-pulse": "glow-pulse 6s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        gridpan: "gridpan 6s linear infinite",
        reveal: "reveal 0.7s ease-out both",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};
