/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base navy scale — the workbench's dark surface.
        navy: {
          50: '#eef1f8',
          100: '#d7ddec',
          200: '#aab6d6',
          300: '#7d8ec0',
          400: '#4f66a9',
          500: '#334f8f',
          600: '#233a6e',
          700: '#182a52',
          800: '#101c3b',
          850: '#0c1730',
          900: '#0a1329',
          950: '#060a19',
        },
        // Yellow accent — a deliberate nod to workbench/tool imagery
        // (measuring tape, pencils, caution markings), not an arbitrary pick.
        accent: {
          DEFAULT: '#ffc531',
          50: '#fff8e6',
          100: '#ffecb8',
          200: '#ffe08a',
          300: '#ffd45c',
          400: '#ffc531',
          500: '#f2ab00',
          600: '#c98e00',
          ink: '#3d2b00',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        card: '0.875rem',
      },
    },
  },
  plugins: [],
}
