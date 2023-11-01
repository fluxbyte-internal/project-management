/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F8FBFF",
          100: "#E9F2FF",
          200: "#E2E8F0",
          300: "#E2E8F0",
          400: "#DCDFE4",
          900: "#44546F",
        },
        success: "#22AD5C",
        warning: "#F59E0B",
        danger: "#F56060",
      },
    },
  },
  plugins: [],
};
