/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },

  //This plug in is added for multiple line clamp. i have added it when i was building the card for listing and want to line clamp for truncate the description of the listing-> This is from github docs for lineclamp using tailwind coz there are no build in class for multiple line truncate->
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}