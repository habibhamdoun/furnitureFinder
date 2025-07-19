/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './components/*.{js,jsx,ts,tsx}',
    './global.css',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bce5cd',
          300: '#8dd1ab',
          400: '#5bb682',
          500: '#3a9b62',
          600: '#2a7c4d',
          700: '#226340',
          800: '#1e4f35',
          900: '#1a412d',
        },
      },
    },
  },
  plugins: [],
};
