/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        xperience: {
          purple: '#6C47C9',
          lightPurple: '#7B52DE',
          darkPurple: '#5635A6',
          bgPurple: '#6A41C9',
          navyCard: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
