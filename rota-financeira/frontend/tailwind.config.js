/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#0A0912',        // fundo quase preto, leve tom roxo
          surface: '#151220',   // cards
          surface2: '#1D1A2B',  // cards elevados / inputs
          border: '#2A2640',
        },
        brand: {
          50: '#F4EEFF',
          100: '#E5D9FF',
          200: '#CBB3FF',
          300: '#AC85FF',
          400: '#9161FA',
          500: '#7C3AED', // roxo principal
          600: '#6425D1',
          700: '#4C1D95', // roxo profundo
          800: '#3A1673',
          900: '#241047',
        },
        ink: {
          high: '#F6F4FB',   // texto principal
          mid: '#B7B0CC',    // texto secundário
          low: '#78708F',    // texto terciário / placeholder
        },
        good: '#34D399',  // lucro positivo
        bad: '#F87171',   // custo / negativo
        warn: '#FBBF24',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124,58,237,0.25), 0 8px 30px -8px rgba(124,58,237,0.45)',
        card: '0 4px 24px -6px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'route-dash': 'repeating-linear-gradient(90deg, currentColor 0, currentColor 6px, transparent 6px, transparent 14px)',
      },
    },
  },
  plugins: [],
}
