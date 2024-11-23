/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    fontFamily: {
      sora: ["Sora", "Serif"],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [],
    darkTheme: false,
    styled: true,
  },
};
