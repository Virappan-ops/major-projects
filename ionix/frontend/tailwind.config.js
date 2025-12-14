/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",

        sidebar: {
          DEFAULT: "var(--sidebar-bg)",
          foreground: "var(--sidebar-text)",
          border: "var(--sidebar-border)",
          hover: "var(--sidebar-hover)",
        },

        border: "hsl(var(--border))",
      },
      transitionProperty: {
        colors: "color, background-color, border-color, text-decoration-color, fill, stroke",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
