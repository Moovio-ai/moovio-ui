
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
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#E50914',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          foreground: '#FFFFFF'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: '#2A2A2A',
          foreground: '#B3B3B3'
        },
        accent: {
          DEFAULT: '#333333',
          foreground: '#FFFFFF'
        },
        popover: {
          DEFAULT: '#1A1A1A',
          foreground: '#FFFFFF'
        },
        card: {
          DEFAULT: '#1A1A1A',
          foreground: '#FFFFFF'
        },
        moovio: {
          dark: '#0A0A0A',
          darker: '#000000',
          gray: '#2A2A2A',
          'gray-light': '#4A4A4A',
          red: '#E50914',
          'red-dark': '#B8070F'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(100%)'
          },
          '100%': {
            transform: 'translateY(0)'
          }
        },
        'pulse-recording': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: '0.7'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse-recording': 'pulse-recording 1.5s ease-in-out infinite'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
