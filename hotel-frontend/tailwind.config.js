/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af", // Professional Blue (blue-800)
        secondary: "#1d4ed8", // Brighter Blue (blue-700)
        accent: "#f59e0b", // Warm Amber for CTAs (amber-500)
        neutral: "#334155", // Slate-700
        "base-100": "#ffffff", // Pure White
        "base-200": "#f8fafc", // Slate-50 (Light Gray)
        "info": "#3b82f6",
        "success": "#22c55e",
        "warning": "#fbbf24",
        "error": "#ef4444",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
}
