import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0d9488', hover: '#0f766e', light: '#ccfbf1' },
        ink: { DEFAULT: '#1c1917', body: '#44403c', muted: '#78716c' },
        surface: { DEFAULT: '#ffffff', soft: '#fafaf9', alt: '#f5f5f4' },
        line: '#e7e5e4',
      },
    },
  },
  plugins: [],
};
export default config;
