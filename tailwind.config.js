import scrollbarPlugin from "tailwind-scrollbar";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                'xs': '360px',
                'sm': '428px',
            },
        },
    },
    plugins: [scrollbarPlugin],
}

