import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ibam-navy': '#2C3E50',
        'ibam-navy-dark': '#1a252f',
        'ibam-turquoise': '#4ECDC4',
        'ibam-turquoise-dark': '#3fb8b1',
      },
    },
  },
  plugins: [],
}

export default config