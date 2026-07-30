/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brandBrown: "#3C2A21",
        brandBlue: "#89CFF0",
      },
    },
  },
  plugins: [],
};