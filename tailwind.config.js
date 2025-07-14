/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'tamil-saffron': '#F4A261',
        'tamil-turmeric': '#E9C46A',
        'tamil-sandalwood': '#F4E3D3',
        'tamil-red': '#9B2226',
        'tamil-brown': '#8B4513',
        'tamil-gold': '#DAA520',
        'tamil-brown': '#8B4513',
        'tamil-gold': '#DAA520',
      },
      fontFamily: {
        tamil: ['Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
