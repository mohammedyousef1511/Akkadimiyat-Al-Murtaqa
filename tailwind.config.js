/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a8a', // blue-900
          hover: '#1e40af', // blue-800
        },
        secondary: '#64748b', // slate-500
        accent: '#f59e0b', // amber-500
      },
      fontFamily: {
        'arabic': ['Cairo', 'ui-sans-serif', 'system-ui'],
      },
      spacing: {
        'section': '2rem',
        'container': '1.5rem',
      },
      borderRadius: {
        'container': '0.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
