/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          green: '#238636',
          red: '#da3633',
          accent: '#58a6ff'
        }
      }
    },
  },
  plugins: [],
}