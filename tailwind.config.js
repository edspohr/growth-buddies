/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",
    "./servicios/**/*.{html,js}",
    "./soluciones/**/*.{html,js}",
    "./equipo/**/*.{html,js}",
    "./blog/**/*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Keep Inter as base
        display: ["Space Grotesk", "sans-serif"], // Add display font for headers
      },
      colors: {
        accent: "#00f6ff",
        dark: "#050510", // Deeper, slightly blueish dark
        primary: "#ffffff",
        secondary: "#94a3b8",
        glass: "rgba(255, 255, 255, 0.05)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(to right bottom, #050510, #0a0a20)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulse_glow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0, 246, 255, 0.1)" },
          "50%": { boxShadow: "0 0 25px rgba(0, 246, 255, 0.4)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse_glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
