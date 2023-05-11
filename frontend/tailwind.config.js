/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent': '#189AB4',
        'accent-muted': '#05445E',
        'subtext': '#111827',
      },
      gridTemplateColumns: {
        'auto-fill': 'repeat(auto-fill, 198px)'
      }
    },

  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
