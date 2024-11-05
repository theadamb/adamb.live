/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#6366f1',
        'secondary': '#8b5cf6',
      },
      keyframes: {
        'flow-pulse-outer': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        },
        'flow-pulse-inner': {
          '0%': { transform: 'scale(0)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' }
        },
        'flow-converge': {
          '0%': { transform: 'scale(3)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'scale(0)', opacity: '0' }
        }
      },
      animation: {
        'flow-pulse-outer': 'flow-pulse-outer 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'flow-pulse-inner': 'flow-pulse-inner 2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards',
        'flow-converge': 'flow-converge 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards'
      }
    },
  },
  plugins: [],
}