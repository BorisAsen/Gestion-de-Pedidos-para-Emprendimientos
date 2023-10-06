/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      spacing: {
        // Ancho de la barra lateral de navegacion
        'navBarExtended': '18em',  // Ancho extendido
        'navBarCollapsed': '4em', // Ancho colapsado
      },

      // Paleta de colores personalizados
      colors: {
        primary: '#91979c',
        secondary: '#3e4142',
        tertiary: '#4d5052',
        blackBase: '#2b2d2e',
        details_1: '#ffd500',
        details_2: '#4f46e5',
        details_3: '#6366f1',

        navBar_Icon: '#353738',
        navBar_IconHover: '#262829'
      },

      // Sombra personalizada
      boxShadow: {
        'navBar': '0 0 0.6em rgba(0, 0, 0, 0.9)',
        // 'navBarIcon': '0 0 0.5em rgba(0, 0, 0, 0.3)',
        'navBarIcon': '-0.1em -0.1em 0.4em rgba(130, 130, 130, 0.4), 0.1em 0.1em 0.4em rgba(0, 0, 0, 0.3)',
        //'navBarIconHover': 'inset -0.1em -0.1em 0.2em rgba(150, 150, 150, 0.4), inset 0.1em 0.1em 0.25em rgba(0, 0, 0, 0.5)',
        //'navBarIconHover': '0 0.2em 0.7em rgba(0, 0, 0, 0.3)',
        'taskCardIcon': '0 0.1em 0.2em rgba(0, 0, 0, 0.3)',
        'container': '0 0.3em 0.5em rgba(0, 0, 0, 0.5)',
        'SearchResult': 'inset 0 0 0.6em rgba(255, 0, 0, 0.9)',
        'Paginador': '0 0 0.6em rgba(0, 0, 0, 0.5)',
      }

      

    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
