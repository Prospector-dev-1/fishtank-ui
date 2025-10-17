import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
      },
      screens: {
        sm: "390px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "720px", // Max content width for mobile-first
      },
    },
    extend: {
      /* iOS-Inspired Design System */
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          pressed: "hsl(var(--primary-pressed))",
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        gray: {
          50: "hsl(var(--gray-50))",
          100: "hsl(var(--gray-100))",
          200: "hsl(var(--gray-200))",
          300: "hsl(var(--gray-300))",
          400: "hsl(var(--gray-400))",
          500: "hsl(var(--gray-500))",
          600: "hsl(var(--gray-600))",
          700: "hsl(var(--gray-700))",
          800: "hsl(var(--gray-800))",
          900: "hsl(var(--gray-900))",
        },
      },
      /* iOS Shadows with subtle elevation */
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      /* iOS Border Radius Scale */
      borderRadius: {
        'sm': 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        'full': 'var(--radius-full)',
      },
      /* 8-Point Spacing System */
      spacing: {
        '0': '0',
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '11': '44px', // iOS touch target
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '18': '72px',
        '20': '80px',
        '24': '96px',
        '28': '112px',
        '32': '128px',
      },
      /* iOS Typography Scale */
      fontSize: {
        'hero': ['34px', { lineHeight: '1.24', letterSpacing: '-0.015em', fontWeight: '700' }],
        'title-1': ['28px', { lineHeight: '1.29', letterSpacing: '-0.013em', fontWeight: '700' }],
        'title-2': ['22px', { lineHeight: '1.27', letterSpacing: '-0.012em', fontWeight: '600' }],
        'title-3': ['20px', { lineHeight: '1.3', letterSpacing: '-0.011em', fontWeight: '600' }],
        'body': ['17px', { lineHeight: '1.47', letterSpacing: '-0.01em' }],
        'callout': ['16px', { lineHeight: '1.38', letterSpacing: '-0.009em' }],
        'subhead': ['15px', { lineHeight: '1.4', letterSpacing: '-0.008em' }],
        'footnote': ['13px', { lineHeight: '1.38', letterSpacing: '-0.006em' }],
        'caption-1': ['12px', { lineHeight: '1.33', letterSpacing: '0' }],
        'caption-2': ['11px', { lineHeight: '1.27', letterSpacing: '0.006em' }],
      },
      /* SwiftUI-Inspired Animations */
      keyframes: {
        // iOS spring animations
        "spring-in": {
          "0%": { 
            transform: "scale(0.95) translateY(10px)", 
            opacity: "0" 
          },
          "60%": { 
            transform: "scale(1.02) translateY(-2px)", 
            opacity: "1" 
          },
          "100%": { 
            transform: "scale(1) translateY(0)", 
            opacity: "1" 
          },
        },
        "spring-out": {
          "0%": { 
            transform: "scale(1)", 
            opacity: "1" 
          },
          "40%": { 
            transform: "scale(0.98)", 
            opacity: "0.8" 
          },
          "100%": { 
            transform: "scale(0.95) translateY(10px)", 
            opacity: "0" 
          },
        },
        "slide-in-bottom": {
          "0%": { 
            transform: "translateY(100%)" 
          },
          "100%": { 
            transform: "translateY(0)" 
          },
        },
        "slide-out-bottom": {
          "0%": { 
            transform: "translateY(0)" 
          },
          "100%": { 
            transform: "translateY(100%)" 
          },
        },
        "slide-in-right": {
          "0%": { 
            transform: "translateX(100%)" 
          },
          "100%": { 
            transform: "translateX(0)" 
          },
        },
        "fade-in": {
          "0%": { 
            opacity: "0" 
          },
          "100%": { 
            opacity: "1" 
          },
        },
        "fade-out": {
          "0%": { 
            opacity: "1" 
          },
          "100%": { 
            opacity: "0" 
          },
        },
        "scale-in": {
          "0%": { 
            transform: "scale(0.95)", 
            opacity: "0" 
          },
          "100%": { 
            transform: "scale(1)", 
            opacity: "1" 
          },
        },
        "bounce-tap": {
          "0%, 100%": { 
            transform: "scale(1)" 
          },
          "50%": { 
            transform: "scale(0.98)" 
          },
        },
      },
      animation: {
        // SwiftUI-like durations (120-320ms)
        "spring-in": "spring-in 280ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "spring-out": "spring-out 220ms cubic-bezier(0.6, 0, 0.8, 0.2)",
        "slide-in-bottom": "slide-in-bottom 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out-bottom": "slide-out-bottom 240ms cubic-bezier(0.6, 0, 0.8, 0.2)",
        "slide-in-right": "slide-in-right 280ms cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 200ms ease-out",
        "fade-out": "fade-out 180ms ease-in",
        "scale-in": "scale-in 180ms ease-out",
        "bounce-tap": "bounce-tap 120ms ease-out",
      },
      /* iOS Transition Durations */
      transitionDuration: {
        '120': '120ms',
        '180': '180ms',
        '220': '220ms',
        '240': '240ms',
        '280': '280ms',
        '320': '320ms',
      },
      /* iOS Spring Easing */
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'spring-smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ios': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;