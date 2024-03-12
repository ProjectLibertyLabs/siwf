/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
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
        'dark-blue': '#2C333D',
        'light-blue': '#007DA1',
        // flowbite-svelte
        primary: {
          50: '#FFF5F2',
          100: '#FFF1EE',
          200: '#FFE4DE',
          300: '#FFD5CC',
          400: '#FFBCAD',
          500: '#FE795D',
          600: '#EF562F',
          700: '#EB4F27',
          800: '#CC4522',
          900: '#A5371B',
        },
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
  plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
};
