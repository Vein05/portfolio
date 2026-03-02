/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      main: "#E0D0C1",
    },
    extend: {
      colors: {
        // Paper aesthetic design tokens
        "paper-light": "#f5f0e8",
        "paper-surface": "#edeae0",
        "ink-dark": "#1a1a14",
        "ink-muted": "#6b6560",
        "ink-blue": "#2563eb",
        "ink-red": "#dc2626",
        "blue-soft": "#dbeafe",
        "border-paper": "#d4cfc4",
      },
      fontFamily: {
        sans: ["Oswald", "sans-serif"],
        clash: ["Oswald", "sans-serif"],
        serif: ["Oswald", "sans-serif"],
        mono: ["Oswald", "monospace"],
      },
    },
  },
  plugins: [],
});
