/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"M PLUS Rounded 1c"', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'ping-short': 'ping 0.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
  // Safelist dynamic classes used in code (e.g., bg-${color}-400)
  safelist: [
    {
      pattern: /(bg|text|border|ring|accent|from|to|via)-(pink|blue|cyan|purple|yellow|slate|gray|rose|red|green|orange)-[1-9]00/,
      variants: ['hover', 'focus', 'group-hover', 'active'],
    },
    {
       pattern: /(bg|text|border|ring|accent)-(pink|blue|cyan|purple|yellow|slate|gray|rose|red|green|orange)-(50|100|200|300|400|500|600|700|800|900)\/.*/,
    }
  ]
}