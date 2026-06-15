import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        // sohojAI brand palette
        electric: '#274DFE', // Electric Flow Blue — primary
        navy: '#1A1D54', // Deep Tech Navy — text / deep backgrounds
        azure: '#518CFF', // Azure Highlight — hover / accents
        slate: '#F8FAFC', // Clean Slate — backgrounds / cards
      },
      fontFamily: {
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        bangla: ['var(--font-hind)', 'var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(26, 29, 84, 0.12)',
        card: '0 8px 30px -10px rgba(26, 29, 84, 0.15)',
        glow: '0 20px 60px -15px rgba(39, 77, 254, 0.45)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.55' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        marquee: 'marquee 28s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
export default config
