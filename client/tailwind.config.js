/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#6366F1",
        background: "#F5F7FB",
        surface: "#FFFFFF",
        border: "#E7ECF3",
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#0EA5E9",
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass-glow': '0 0 20px 2px rgba(139, 92, 246, 0.15)',
        'success-glow': '0 0 20px 2px rgba(16, 185, 129, 0.15)',
        'danger-glow': '0 0 20px 2px rgba(239, 68, 68, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
