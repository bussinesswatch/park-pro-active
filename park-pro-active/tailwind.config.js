/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary pink/coral gradient palette
        primary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        // Coral accent
        coral: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Cream/beige background
        cream: {
          50: '#fdfbf7',
          100: '#f9f6f0',
          200: '#f5f0e8',
          300: '#ede4d3',
          400: '#e3d5b8',
          500: '#d4c19a',
        },
        // Dark navy sidebar
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Soft pink accents
        soft: {
          pink: '#ffd1dc',
          rose: '#ffe4e1',
          peach: '#ffdab9',
          lavender: '#e6e6fa',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
        'gradient-card': 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
