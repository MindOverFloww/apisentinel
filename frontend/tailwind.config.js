/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Montserrat', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '26px',
        '4xl': '32px',
      },
      backdropBlur: {
        'glass': '24px',
        'heavy': '32px',
      },
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.45)',
          'light-hover': 'rgba(255, 255, 255, 0.60)',
          smoked: 'rgba(40, 40, 40, 0.75)',
          'smoked-hover': 'rgba(30, 30, 30, 0.85)',
          dark: 'rgba(20, 20, 20, 0.88)',
        },
        charcoal: {
          950: '#0c0c0e',
          900: '#141416',
          800: '#1e1e22',
          700: '#2b2b30',
          600: '#3e3e46',
          500: '#565660',
        }
      },
      boxShadow: {
        'glass-soft': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'glass-lift': '0 16px 40px -10px rgba(0, 0, 0, 0.12)',
        'smoked-lift': '0 20px 48px -10px rgba(0, 0, 0, 0.35)',
        'pill': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'glass-light': '0 20px 45px -15px rgba(0, 0, 0, 0.06), 0 0 1px 1px rgba(255, 255, 255, 0.9) inset',
        'glass-dark': '0 25px 50px -15px rgba(0, 0, 0, 0.4), 0 0 1px 1px rgba(255, 255, 255, 0.18) inset',
        'floating-dock': '0 24px 48px -12px rgba(0, 0, 0, 0.18), 0 0 1px 1px rgba(255, 255, 255, 0.6) inset',
      }
    },
  },
  plugins: [],
}
