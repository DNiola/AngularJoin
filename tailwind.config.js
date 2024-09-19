/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.ts',
  ],
  theme: {
    extend: {
      colors: {
        'normalBlue': '#2A3647',
        'lightBlue': '#29ABE2',
        'darkBlue': '#091931', // the button color after click
        'smokeGray': '#CDCDCD',
        'whiteSmoke': '#F5F5F5',
        'lightGray': '#A8A8A8',
        'lightRed': '#FF8190',
        'menuHoverBlue': '#3b3d59',
        'titleActiveBlue': '#42526E',
      },
      boxShadow: {
        'lightShadow': '0px 4px 6px 0px rgba(0, 0, 0, 0.33);',
        'headerShadow': '0px 4px 4px 0px rgba(0, 0, 0, 0.1)',
        'smallShadow': '0px 0px 14px 3px rgba(0, 0, 0, 0.04);',
        'overviewShadow': '0px 0px 4px 0px rgba(0, 0, 0, 0.1)',
        'overviewShadowHover': '0px 4px 4px 0px rgba(0, 0, 0, 0.25);',
        'prioShadow': '0px 4px 4px 0px rgba(0, 0, 0, 0.25);',

      }
    },

  },
  plugins: [],
} 