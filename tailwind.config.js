/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  darkMode: 'class', // enables 'dark' class support
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      transitionProperty: {
        'bg': 'background-color',
        'colors': 'color, background-color, border-color',
      },
    },
  },
  plugins: [],
};

