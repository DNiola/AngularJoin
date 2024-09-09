/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.ts',
  ],
  theme: {
    extend: {
      colors: {
        'darkBlue': '#2A3647',
        'lightBlue': '#29ABE2',
        'whiteSmoke': '#F5F5F5', 
        'lightGray': '#A8A8A8',
        'lightRed': '#FF8190',
      },
      boxShadow: {
        'lightShadow': '0px 4px 6px 0px rgba(0, 0, 0, 0.33);',
        'smallShadow': '0px 0px 14px 3px rgba(0, 0, 0, 0.04);',
      }
    },

  },
  plugins: [],
}

