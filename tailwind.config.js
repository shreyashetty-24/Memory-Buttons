/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{ts,tsx,js,jsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                pixelcursive: ['"Press Start 2P"', 'cursive'],
                clean: ['Inter', 'sans-serif'],
                handwritten: ['Caveat', 'cursive']
            }
        },
    },
    plugins: [],
}
