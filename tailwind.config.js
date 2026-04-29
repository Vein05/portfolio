/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,astro}"],
  theme: {
    colors: {
      main: "rgb(var(--color-main) / <alpha-value>)",
    },
    extend: {
      colors: {
        // Paper aesthetic design tokens
        "paper-light": "rgb(var(--color-paper-light) / <alpha-value>)",
        "paper-surface": "rgb(var(--color-paper-surface) / <alpha-value>)",
        "ink-dark": "rgb(var(--color-ink-dark) / <alpha-value>)",
        "ink-muted": "rgb(var(--color-ink-muted) / <alpha-value>)",
        "ink-blue": "rgb(var(--color-ink-blue) / <alpha-value>)",
        "ink-red": "rgb(var(--color-ink-red) / <alpha-value>)",
        "blue-soft": "rgb(var(--color-blue-soft) / <alpha-value>)",
        "border-paper": "rgb(var(--color-border-paper) / <alpha-value>)",
        "bar-border": "rgb(var(--color-bar-border) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Oswald", "sans-serif"],
        clash: ["Oswald", "sans-serif"],
        serif: ["Oswald", "sans-serif"],
        mono: ["Oswald", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
