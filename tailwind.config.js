/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': 'Roboto',
        'archivo': '"Archivo Black"',
    },
  },
},
  plugins: [
    require('daisyui'),
    require('tailwindcss-motion'),
    require('tailwindcss-intersect'),
    function({ addUtilities }) {
      const newUtilities = {
        '.text-stroke': {
          '-webkit-text-stroke-width': '0.5px',
          '-webkit-text-stroke-color': 'black',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}