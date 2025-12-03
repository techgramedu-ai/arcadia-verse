import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        cosmic: {
          cyan: "hsl(var(--cosmic-cyan))",
          magenta: "hsl(var(--cosmic-magenta))",
          violet: "hsl(var(--cosmic-violet))",
          blue: "hsl(var(--cosmic-blue))",
          pink: "hsl(var(--cosmic-pink))",
          gold: "hsl(var(--cosmic-gold))",
          green: "hsl(var(--cosmic-green))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        glow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: "glow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
      },
      backgroundImage: {
        "gradient-cosmic": "linear-gradient(135deg, hsl(var(--cosmic-cyan)) 0%, hsl(var(--cosmic-magenta)) 50%, hsl(var(--cosmic-violet)) 100%)",
        "gradient-neon": "linear-gradient(90deg, hsl(var(--cosmic-cyan)) 0%, hsl(var(--cosmic-magenta)) 100%)",
        "gradient-radial": "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "glow-sm": "0 0 10px hsl(var(--cosmic-cyan) / 0.3)",
        "glow-md": "0 0 20px hsl(var(--cosmic-cyan) / 0.4)",
        "glow-lg": "0 0 30px hsl(var(--cosmic-cyan) / 0.5)",
        "glow-magenta": "0 0 20px hsl(var(--cosmic-magenta) / 0.4)",
        "glow-violet": "0 0 20px hsl(var(--cosmic-violet) / 0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
