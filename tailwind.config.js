/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#f3eadf',
        cream: '#fbf7f0',
        linen: '#e8d7c7',
        cocoa: '#6d4429',
        bronze: '#9a6748',
        ink: '#1d1a18'
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'Segoe UI', 'Arial', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 50px rgba(69, 45, 29, 0.12)'
      }
    }
  },
  plugins: []
};
