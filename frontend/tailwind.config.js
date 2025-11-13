/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 파스텔 톤 색상 팔레트
        pastel: {
          pink: '#FFD6E8',
          purple: '#E6D9FF',
          blue: '#D6F0FF',
          green: '#D6FFE6',
          yellow: '#FFF4D6',
          orange: '#FFE6D6',
          peach: '#FFE0D6',
          lavender: '#F0E6FF',
        },
        // 마정령 속성 색상
        element: {
          fire: '#FFB3BA',
          water: '#BAE1FF',
          wind: '#BAFFC9',
          earth: '#FFDFBA',
          plant: '#FFFFBA',
          electric: '#FFE6BA',
          light: '#FFFACD',
          dark: '#D3D3D3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}

