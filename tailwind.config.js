/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05070c',
        panel: '#0a0f18',
        cyan: {
          glow: '#5eead4',
        },
        accent: {
          DEFAULT: '#38f0e0',
          soft: '#8ef5e8',
        },
        travel: {
          DEFAULT: '#ffb454',
        },
        flora: {
          DEFAULT: '#ff7ab8',
        },
      },
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(94,234,212,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.06) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
