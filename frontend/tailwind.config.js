module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 👈 tells Tailwind to scan all files in src
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