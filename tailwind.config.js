/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17242c",
        brand: { 50: "#eefbfa", 100: "#d5f5f2", 500: "#13969c", 600: "#087f8c", 700: "#076873" }
      },
      boxShadow: { card: "0 1px 2px rgba(22,36,44,.04), 0 8px 30px rgba(22,36,44,.05)" }
    }
  },
  plugins: []
};
