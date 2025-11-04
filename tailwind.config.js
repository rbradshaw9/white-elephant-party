/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // White Elephant theme colors
        'christmas-red': '#FF3B3B',
        'christmas-green': '#2ECC71',
        'christmas-gold': '#FFD700',
        'snow-white': '#FFFFFF',
        // Heist theme colors
        'heist-navy': '#0a0e1a',
        'heist-blue': '#3b82f6',
        'heist-crimson': '#dc2626',
        'heist-gold': '#fbbf24',
        'heist-ice': '#cbd5e1',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'heist': ['Bebas Neue', 'sans-serif'],
        'body': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'snow-fall': 'snow-fall linear infinite',
        'spotlight': 'spotlight 8s ease-in-out infinite',
        'vault-open': 'vault-open 1s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'snow-fall': {
          '0%': { transform: 'translateY(-10vh)', opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0.3' },
        },
        spotlight: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.2)' },
        },
        'vault-open': {
          '0%': { transform: 'scale(0.8) rotateY(-90deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotateY(0deg)', opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(251, 191, 36, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
