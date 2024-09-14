/** @type {import('tailwindcss').Config} */

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    plugins: [],
    theme: {
        extend: {
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideIn: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
            },
            animation: {
                "fade-in": "fadeIn 1s ease-out",
                "slide-in": "slideIn 0.5s ease-out",
            },
            backgroundColor: {
                active: "#2881CF",
                default: "#F7FBFF",
                disabled: "#144B84",
                hover: "#3A98E8"
            },
            textColor: {
                active: "#2881CF",
                default: "#F7FBFF",
                disabled: "#144B84",
                hover: "#3A98E8"
            },
            borderColor: {
                active: "#2881CF",
                default: "#F7FBFF",
                disabled: "#144B84",
                hover: "#3A98E8"
            },
        },
    },
};
