/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F8F7F3',
        navy: '#172033',
        'navy-light': '#1E2D45',
        'navy-dark': '#0F1621',
        lime: '#C9F56A',
        'lime-dark': '#B3E050',
        orange: '#FF6B35',
        'orange-light': '#FF8555',
        'card-bg': '#FFFFFF',
        'border-color': '#E8E6DF',
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(23, 32, 51, 0.06), 0 4px 12px rgba(23, 32, 51, 0.04)',
        'card-hover': '0 4px 16px rgba(23, 32, 51, 0.12), 0 1px 4px rgba(23, 32, 51, 0.08)',
        'lime': '0 0 20px rgba(201, 245, 106, 0.3)',
      }
    },
  },
  plugins: [],
}
