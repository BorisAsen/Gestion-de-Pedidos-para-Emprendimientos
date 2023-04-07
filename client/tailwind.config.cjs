/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      // Paleta de colores personalizados
      colors: {
        primary: '#91979c',
        secondary: '#3e4142',
        tertiary: '#4d5052',
        blackBase: '#2b2d2e',
        details_1: '#ffd500',
        details_2: '#4f46e5',
        details_3: '#6366f1',
      },

      // Sombra personalizada
      boxShadow: {
        'navBar': '0 0 0.6em rgba(0, 0, 0, 0.9)',
        'navBarIcon': '0 0 0.5em rgba(0, 0, 0, 0.3)',
        'navBarIconHover': '0 0.2em 0.7em rgba(0, 0, 0, 0.3)',
        'taskCardIcon': '0 0.1em 0.2em rgba(0, 0, 0, 0.3)',
        'container': '0 0.3em 0.5em rgba(0, 0, 0, 0.5)',
      }

    },
  },
  plugins: [],
}
