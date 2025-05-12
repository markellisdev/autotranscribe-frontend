/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
      },
      colors: {
        primary: '#41B31E', // A nice bright green for primary actions
        primaryLight: '#71CF55',
        primaryDark: '#359119',
        secondary: '#51DE26', // Could be a lighter accent
        accent: '#297013',   // Darker for emphasis
        neutralDarkest: '#18110C', // Very dark color, almost black
        neutralDark: '#1C4C0D',  // Your other dark green
        neutralLight: '#f5f5f5', // Example light neutral
        // You can add more variations if needed
      }
    },
  },
  plugins: [],
}