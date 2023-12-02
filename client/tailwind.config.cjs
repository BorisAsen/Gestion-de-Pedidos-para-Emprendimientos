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
        primary: '#f1f5f9',
        secondary: '#6c59ff',
        tertiary: '#4d5052',
        blackBase: '#2b2d2e',
        details_1: '#ffd500',
        details_2: '#4f46e5',
        details_3: '#6366f1',

        navBar_Icon: '#353738',
        navBar_IconHover: '#262829',

        text_1: '#576578'

      },

      fontSize: {
        'navBar': '1em',
      },

      // Sombra personalizada
      boxShadow: {
        'navBar': '0 0 0.6em rgba(0, 0, 0, 0.5)',
        // 'navBarIcon': '0 0 0.5em rgba(0, 0, 0, 0.3)',
        'navBarIcon': '-0.1em -0.1em 0.4em rgba(130, 130, 130, 0.4), 0.1em 0.1em 0.4em rgba(0, 0, 0, 0.3)',
        //'navBarIconHover': 'inset -0.1em -0.1em 0.2em rgba(150, 150, 150, 0.4), inset 0.1em 0.1em 0.25em rgba(0, 0, 0, 0.5)',
        //'navBarIconHover': '0 0.2em 0.7em rgba(0, 0, 0, 0.3)',
        'taskCardIcon': '0 0.1em 0.2em rgba(0, 0, 0, 0.3)',
        'container': '0 0em 0.3em rgba(0, 0, 0, 0.5)',
        'SearchResult': 'inset 0 0 0.6em rgba(255, 0, 0, 0.9)',
        'Paginador': '0 0 0.3em rgba(0, 0, 0, 0.5)',
        'FilterButton': '0 0 0.15em rgba(200, 200, 200, 0.7)',
      },

    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
