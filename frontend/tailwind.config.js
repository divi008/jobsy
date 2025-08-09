module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  safelist: [
    // keep dynamic dark classes in production
    'bg-[#0b1412]',
    'bg-[#0d1a17]',
    'text-white',
    'text-gray-200',
    'border-[#28c76f]/20',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#129990', // main accent
        secondary: '#90D1CA',
        accent: '#096B68',
        background: '#FFFBDE',
        'primary-rgb': 'rgb(18, 153, 144)',
        'secondary-rgb': 'rgb(144, 209, 202)',
        'accent-rgb': 'rgb(9, 107, 104)',
        'background-rgb': 'rgb(255, 251, 222)',
        'jobsy-green': '#2b9942',
      },
    },
  },
  plugins: [],
};