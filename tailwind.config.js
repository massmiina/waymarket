/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        foreground: "#14532d",
        emerald: {
          DEFAULT: "var(--emerald-primary)",
          hover: "var(--emerald-hover)",
          light: "var(--emerald-light)",
          neon: "var(--emerald-light)",
        },
        "forest-green": "var(--forest-green)",
        "black-exclusive": "var(--black-exclusive)",
        /* Mappings pour compatibilité */
        peaks: "var(--emerald-primary)",
        glacier: "var(--emerald-hover)",
      },
    },
  },
  plugins: [],
};
