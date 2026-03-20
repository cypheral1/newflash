/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                bg: '#ffffff',
                surface: '#fafafa',
                card: '#ffffff',
                border: '#e5e7eb', // gray-200
                primary: '#000000',
                accent: '#3b82f6', // subtle blue
                red: '#ef4444',
                muted: '#6b7280', // gray-500
                text: '#111827', // gray-900
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'float': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            }
        },
    },
    plugins: [],
}
