/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        autodeck: {
          bg: "#0C0E12",
          card: "#191D24",
          cardHover: "#20252E",
          border: "#262C36",
          primary: "#FF6B35",
          primaryHover: "#FF5212",
          secondary: "#F5B942",
          text: "#FFFFFF",
          muted: "#A1A6AF",
          subtle: "#14171E",
        },
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(255, 107, 53, 0.35)",
        "glow-gold": "0 0 25px -5px rgba(245, 185, 66, 0.35)",
        "card-hover": "0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 20px -2px rgba(255, 107, 53, 0.2)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

