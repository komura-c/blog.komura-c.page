/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    theme: {
      extend: {
        fontFamily: {
          body: defaultTheme.fontFamily.sans,
        },
        gridTemplateColumns: {
          list: "repeat(auto-fill, minmax(400px, max-content))",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
