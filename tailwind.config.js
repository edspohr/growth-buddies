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
    "./nosotros/**/*.{html,js}",
    "./privacidad/**/*.{html,js}",
    "./terminos/**/*.{html,js}",
    "./404.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        heading: ["Geist", "system-ui", "sans-serif"],
        // Space Grotesk kept in @font-face but not used as a utility class
        serif:   ["Instrument Serif", "Georgia", "serif"],
      },
      colors: {
        // ── Design token aliases (consumed via CSS vars) ──────────────────
        // These parallel the :root tokens so Tailwind utilities also work.
        bg:            "#0B0B0F",
        surface:       "#14141A",
        line:          "#232330",
        fg:            "#ECECEF",
        "fg-muted":    "#A7A7B2",
        accent:        "#0097B2",
        "accent-strong": "#00B5D6",
        // ── Legacy aliases kept for backward-compat class references ─────
        dark:          "#0B0B0F",
        "dark-card":   "#14141A",
        primary:       "#ECECEF",
        secondary:     "#A7A7B2",
        border:        "#232330",
      },
      // ── Type scale ──────────────────────────────────────────────────────
      fontSize: {
        "display": ["clamp(2.75rem, 5.5vw, 4rem)",   { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "h1":      ["clamp(2rem, 4vw, 3rem)",          { lineHeight: "1.1",  letterSpacing: "-0.02em"  }],
        "h2":      ["clamp(1.5rem, 3vw, 2.25rem)",     { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "h3":      ["clamp(1.125rem, 2vw, 1.5rem)",    { lineHeight: "1.2",  letterSpacing: "-0.01em"  }],
        "body":    ["1.0625rem",                        { lineHeight: "1.6"  }],
        "body-sm": ["0.9375rem",                        { lineHeight: "1.6"  }],
        "eyebrow": ["0.6875rem",                        { lineHeight: "1.4", letterSpacing: "0.12em"   }],
        "caption": ["0.8125rem",                        { lineHeight: "1.5"  }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        // Subtle static hero — no animation
        "hero-static": "radial-gradient(ellipse at 20% 40%, rgba(0,151,178,0.07) 0%, transparent 55%), #0B0B0F",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up-bar": {
          "from": { transform: "translateY(100%)", opacity: "0" },
          "to":   { transform: "translateY(0)",    opacity: "1" },
        },
        "slide-down": {
          "0%":   { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up":      "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up-bar": "slide-up-bar 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-down":   "slide-down 0.25s ease-out",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      minHeight: {
        "85vh": "85vh",
      },
      maxWidth: {
        "prose-cap": "70ch",
      },
      borderRadius: {
        "card": "10px",
      },
    },
  },
  plugins: [],
};
