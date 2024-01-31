/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
      data: ['Space Mono', 'sans-serif'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      disabled: '#BCBAC0',
      'bg-black': '#232326',
      'bg-black-active': '#363639',
      blue: '#459ABA',
      'blue-light': '#69B9CD',
      green: '#6EE9D1',
      'green-success': '#7CFA4D',
      divider: '#504D4D',
      overlay: 'rgba(57, 52, 52, 0.75)',
      error: '#E70F0F',
    },
    width: {
      modal: '420px',
      'single-block': '550px',
      dashboard: '1010px',
      full: '100%',
    },
    extend: {
      borderRadius: {
        'rounded-3xl': '20px',
        'rounded-md': '5px',
      },
      boxShadow: {
        md: '0px 4px 7px rgba(0,0,0,.25)',
        'blue-border': '8px 0 0 #69B9CD',
      },
      backgroundImage: {
        topRight: 'url(/assets/top-right-bars.png)',
      },
      fontSize: {
        xs: '10px',
        sm: '12px',
        base: '14px',
        lg: '20px',
        xl: '25px',
        '2xl': '30px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
