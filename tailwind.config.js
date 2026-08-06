/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#faf8f2",
        ink: "#1a1a1a",
        "ink-faint": "#6b6b63",
        "ink-rule": "#d8d4c6",
      },
      fontFamily: {
        mono: ["Courier Prime", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
}
