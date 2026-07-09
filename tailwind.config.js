/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17242c",
        brand: { 50: "#eefbfa", 100: "#d5f5f2", 200: "#aee8e3", 300: "#73d2d0", 500: "#13969c", 600: "#087f8c", 700: "#076873", 800: "#07515b", 900: "#083f48" },
        surface: { page: "#f6f8fa", card: "#ffffff", muted: "#f1f5f9" },
        success: "#047857",
        warning: "#b45309",
        danger: "#be123c",
        info: "#0369a1"
      },
      borderRadius: { card: "0.75rem" },
      boxShadow: { card: "0 1px 2px rgba(22,36,44,.04), 0 10px 26px rgba(22,36,44,.055)", popover: "0 18px 60px rgba(15,23,42,.16)" }
    }
  },
  plugins: []
};
