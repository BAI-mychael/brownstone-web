/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brownstone-gray': '#4A4A4A',
        'brownstone-brown': '#8B5A2B',
        'brownstone-black': '#000000',
        'brownstone-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
}