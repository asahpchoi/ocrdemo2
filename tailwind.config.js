/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'scan-line': 'scan-line 2s linear infinite',
        'scan-overlay': 'scan-overlay 2s ease-in-out infinite',
        'float-1': 'float-1 3s ease-in-out infinite',
        'float-2': 'float-2 2.5s ease-in-out infinite',
        'float-3': 'float-3 3.5s ease-in-out infinite',
      },
      keyframes: {
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'scan-overlay': {
          '0%': { opacity: '0.1' },
          '50%': { opacity: '0.2' },
          '100%': { opacity: '0.1' },
        },
        'float-1': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translate(100%, 100%)', opacity: '0' },
        },
        'float-2': {
          '0%': { transform: 'translate(100%, 0%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translate(0%, 100%)', opacity: '0' },
        },
        'float-3': {
          '0%': { transform: 'translate(50%, 0%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translate(50%, 100%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
