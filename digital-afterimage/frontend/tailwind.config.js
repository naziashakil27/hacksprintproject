/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nude: {
          bg: "#F7F1EA",
          surface: "#FFF9F4",
          soft: "#F1E6DC",
          border: "#D8C9BC",
          borderSoft: "#E6D9CD",
          text: "#342C28",
          muted: "#81746B",
          accent: "#B86F62",
          accentSoft: "#E8C8BE",
          warning: "#C28A58",
          danger: "#A9564F",
          success: "#788B72",
          dark: "#443A35",
          rose: "#E5C9BF",
          peach: "#F4E3D7",
          cream: "#FAF5EF"
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(52, 44, 40, 0.04)',
        'panel': '0 4px 20px rgba(52, 44, 40, 0.06)',
        'modal': '0 20px 40px rgba(52, 44, 40, 0.15)',
      }
    },
  },
  plugins: [],
}
