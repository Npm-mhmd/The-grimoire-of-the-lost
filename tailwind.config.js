/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink:       '#0c0a08',
        parchment: '#e8d9b0',
        vellum:    '#d4c49a',
        gold:      '#c8a84b',
        'gold-dim':'#8a6f2e',
        ember:     '#c8622a',
        ash:       '#c8b89a',
        'ash-dim': '#7a6a54',
        leather:   '#2a1608',
        'leather-light': '#3e2410',
      },
      fontFamily: {
        display:     ['"Cinzel Decorative"', 'Cinzel', 'Georgia', 'serif'],
        cinzel:      ['Cinzel', 'Georgia', 'serif'],
        fell:        ['"IM Fell English"', 'Georgia', 'serif'],
        handwriting: ['Caveat', 'cursive'],
        body:        ['"IM Fell English"', 'Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'parchment-grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      animation: {
        'spin-slow':  'spin 10s linear infinite',
        'spin-rune':  'spin 18s linear infinite',
        'float':      'float-y 5s ease-in-out infinite',
        'flicker':    'flicker 8s ease-in-out infinite',
        'ember':      'ember-rise 3s ease-out infinite',
        'pulse-gold': 'pulse 3s ease-in-out infinite',
      },
      boxShadow: {
        'candle': '0 0 15px rgba(255,160,50,0.15), 0 0 40px rgba(255,140,30,0.08)',
        'gold-glow': '0 0 20px rgba(200,168,75,0.25), 0 0 60px rgba(200,168,75,0.1)',
        'inner-dark': 'inset 0 0 60px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
