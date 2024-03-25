/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    screens: {
      xs: { max: '511px' },
      sm: { min: '512px' },
      md: { min: '768px' },
      lg: { min: '1024px' },
      xl: { min: '1280px' },
    },

    extend: {
      borderRadius: {
        'rounded-3xl': '20px',
        'rounded-md': '5px',
      },
      boxShadow: {
        md: '0px 4px 7px rgba(0,0,0,.25)',
      },
      backgroundImage: {
        topRight: 'url(/assets/top-right-bars.png)',
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        white: '#ffffff',
        black: '#222222',
        cobalt: '#4B64FF',
        scarlet: '#F82013',
        silver: '#D3D3D3',
        aqua: '#69B9CD',
        lilac: 'rgb(243,206,255, 0.4)',
        periwinkle: 'rgb(120,159,243,0.4)',
        'teal-light': 'rgb(175,235,244,0.4)',
        'teal-dark': 'rgb(84,158,170,0.4)',
        'white-transparent': 'rgb(254,255,255,.1)',
      },
      top: {
        35: '35px',
      },
      width: {
        500: '500px',
        600: '600px',
        720: '720px',
        800: '820px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
