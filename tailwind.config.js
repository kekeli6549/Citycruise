/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1E40AF", // The deep professional blue
          lightBlue: "#FFFFF", // Cornflower
          dark: "#0F172A",
        }
      },
      fontFamily: {
        heading: ['Recoleta', 'serif'], // Heading font from your spec
        body: ['Neue Haas Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
      }
    },
  },
  plugins: [],
}