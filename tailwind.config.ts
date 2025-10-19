import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
      fontSize: {
        // iOS Typography Scale
        'hero': ['2.125rem', { lineHeight: '2.5rem', fontWeight: '700', letterSpacing: '-0.025em' }], // 34px
        'title-1': ['1.75rem', { lineHeight: '2.125rem', fontWeight: '700', letterSpacing: '-0.02em' }], // 28px
        'title-2': ['1.375rem', { lineHeight: '1.75rem', fontWeight: '600', letterSpacing: '-0.015em' }], // 22px
        'title-3': ['1.25rem', { lineHeight: '1.5rem', fontWeight: '600', letterSpacing: '-0.01em' }], // 20px
        'body': ['1.0625rem', { lineHeight: '1.375rem', fontWeight: '400' }], // 17px
        'callout': ['1rem', { lineHeight: '1.25rem', fontWeight: '400' }], // 16px
        'subhead': ['0.9375rem', { lineHeight: '1.25rem', fontWeight: '400' }], // 15px
        'footnote': ['0.8125rem', { lineHeight: '1.125rem', fontWeight: '400' }], // 13px
        'caption-1': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }], // 12px
        'caption-2': ['0.6875rem', { lineHeight: '0.875rem', fontWeight: '400' }], // 11px
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

