/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf7f0',
          100: '#f4ede0',
          200: '#e8d8bf',
          300: '#d9bf95',
          400: '#c9a26a',
          500: '#bc8a4f',
          600: '#af7543',
          700: '#925e39',
          800: '#774c33',
          900: '#613f2d',
          950: '#352016',
        },
        secondary: {
          50: '#f7f7f6',
          100: '#e5e5e2',
          200: '#cbcbc5',
          300: '#aaaaa0',
          400: '#8c8c7f',
          500: '#737366',
          600: '#5c5c50',
          700: '#4a4a42',
          800: '#3e3e38',
          900: '#363632',
          950: '#1c1c1a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'touch': '44px', // Minimum touch target
      },
    },
  },
  plugins: [],
}