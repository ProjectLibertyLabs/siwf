/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
      data: ['Space Mono', 'sans-serif'],
    },
    width: {
      modal: '420px',
      full: '100%',
    },
    extend: {
      backgroundImage: {
        bgGradient: 'linear-gradient(to top, #2c333d, #007da1)',
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        disabled: '#BCBAC0',
        button: '#DCDCDC',
      },
      borderRadius: {
        'rounded-md': '5px',
      },
      fontSize: {
        xs: '10px',
        sm: '12px',
        base: '14px',
        md: '16px',
        lg: '20px',
        xl: '25px',
        '2xl': '30px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
