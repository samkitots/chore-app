/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-green': '#f8fcfa', // Very light green for background and input fields
        'dark-green': '#4e977f', // Muted green for text and placeholders
        'vibrant-green': '#47eab4', // Bright, saturated green for the button
      },
    },
  },
  plugins: [],
}