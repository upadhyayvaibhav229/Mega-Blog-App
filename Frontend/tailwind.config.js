/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // add color
      colors: {
        primary: '#5044e5',
    },
  },
  plugins: [],
}
}
