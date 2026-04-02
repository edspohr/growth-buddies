/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",
    "./servicios/**/*.{html,js}",
    "./soluciones/**/*.{html,js}",
    "./equipo/**/*.{html,js}",
    "./blog/**/*.{html,js}",
    "./metodologia/**/*.{html,js}",
    "./casos/**/*.{html,js}",
    "./gracias/**/*.{html,js}",
    "./recursos/**/*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
      },
      colors: {
        // Brand accent — emerald green (glow effects, borders, text highlights)
        accent: "#10B981",
        "accent-dark": "#064E3B",
        // CTA — amber/gold (primary action buttons only)
        cta: "#F59E0B",
        "cta-hover": "#D97706",
        // Backgrounds
        dark: "#0F172A",       // deep navy (dark sections)
        "dark-card": "#1E293B", // card on dark background
        // Text
        "body-dark": "#1a1a2e", // near-black body text on light
        // Surfaces (light sections)
        surface: "#FAFAF9",    // stone-50 (not pure white)
        // Legacy / keep for backward compat
        primary: "#ffffff",
        secondary: "#94a3b8",
        glass: "rgba(255, 255, 255, 0.05)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #0F172A 0%, #064E3B 40%, #0F172A 70%, #1E3A5F 100%)",
        "mesh-gradient": "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(15,23,42,0.9) 0%, transparent 60%), radial-gradient(ellipse at 60% 80%, rgba(30,58,138,0.12) 0%, transparent 50%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "mesh-drift": {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "count-up": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "mesh-drift": "mesh-drift 15s ease infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      minHeight: {
        "85vh": "85vh",
      },
    },
  },
  plugins: [],
};
