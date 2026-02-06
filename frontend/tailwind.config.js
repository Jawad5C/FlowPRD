/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Squid Game Color Palette
        'squid-pink': '#ED1B76',
        'squid-teal': '#067D72',
        'squid-gold': '#FFD700',
        'squid-navy': '#0B1C3D',
        'squid-white': '#FFFFFF',
        'squid-light-pink': '#FFE4EC',
        'squid-light-teal': '#E0F5F3',
      },
    },
  },
  plugins: [],
}
