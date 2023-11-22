/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class",],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          50: "#FFFAEB",
          100: "#FFF2C6",
          200: "#FFE388",
          300: "#FFD04A",
          400: "#FFB819",
          500: "#F99807",
          600: "#DD7102",
          700: "#B74E06",
          800: "#943B0C",
          900: "#7A310D",
          950: "#461802",
        },
        gray: {
          50: "#F6F6F6",
          100: "#E7E7E7",
          200: "#D1D1D1",
          300: "#B0B0B0",
          400: "#888888",
          500: "#6D6D6D",
          600: "#5D5D5D",
          700: "#555555",
          800: "#454545",
          900: "#3D3D3D",
          950: "#262626",
        },
        success: "#22AD5C",
        warning: "#F59E0B",
        danger: "#F56060",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
