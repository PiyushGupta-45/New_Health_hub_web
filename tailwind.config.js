/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-dark': '#1e40af',
        secondary: '#10b981',
        danger: '#ef4444', // Red-500
        warning: '#f59e0b', // Amber-500
        bg: '#f8fafc', // Slate-50
        'card-bg': '#ffffff', // White
        text: '#1e293b', // Slate-800
        'text-light': '#64748b', // Slate-500
        border: '#e2e8f0', // Slate-200
      }
    },
    boxShadow: {
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    }
  },
  plugins: [],
}