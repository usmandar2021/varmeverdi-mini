/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F3EC',
        surface: '#FDFCF9',
        ink: '#1B2420',
        'ink-muted': '#5C6660',
        spruce: {
          DEFAULT: '#1C5748',
          deep: '#123B31',
          light: '#287361',
        },
        copper: {
          DEFAULT: '#BC5A28',
          soft: '#E9D9CB',
          hover: '#A44E22',
        },
        amber: {
          DEFAULT: '#E0A03C',
          light: '#F8F1E2',
        },
        teal: '#2E6E73',
        moss: '#5C7A3F',
        sand: {
          DEFAULT: '#E4DCCB',
          deep: '#CFC5AF',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
