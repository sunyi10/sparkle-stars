/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF0F5',
          100: '#FFE4E9',
          200: '#FFB6C1',
          300: '#FF69B4',
          400: '#FF1493',
          500: '#C71585',
        },
        gold: {
          50: '#FFFACD',
          100: '#FFD700',
          200: '#DAA520',
        },
        purple: {
          light: '#E6E6FA',
        },
        blue: {
          light: '#ADD8E6',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #FF69B4, 0 0 10px #FF69B4' },
          '50%': { boxShadow: '0 0 20px #FF69B4, 0 0 30px #FF69B4' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
