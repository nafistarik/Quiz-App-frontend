/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jaldi: ['Jaldi', 'sans-serif'],
        jaro: ['Jaro', 'sans-serif'],
      },
    },
  },
  plugins: [],
}