/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm cream surface — dining-room paper, not stark white
        cream: "#FBF3E7",
        paper: "#FFFFFF",
        // Espresso — primary dark, used for text and dark sections
        espresso: "#2A1810",
        "espresso-light": "#4A3226",
        // Ember — the single accent color, used sparingly for CTAs & emphasis
        ember: "#C1571F",
        "ember-light": "#E08A4F",
        "ember-dark": "#8F3E12",
        // Steam — cool secondary accent for the "time back" story
        steam: "#8FC1DC",
        "steam-dark": "#3E7290",
        // Sage — reserved for savings / positive figures
        sage: "#3F7D58",
        // Text tones
        ink: "#1A1310",
        muted: "#6B5D52",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};