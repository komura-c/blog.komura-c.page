/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4a6fa5',
          light: '#6b8cbe',
          dark: '#2d4a73',
        },
        accent: {
          DEFAULT: '#ff7e5f',
          light: '#feb47b',
        },
        text: {
          DEFAULT: '#333333',
          light: '#666666',
        },
        background: {
          DEFAULT: '#ffffff',
          alt: '#f8f9fa',
        },
        border: '#e0e0e0',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', '"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', 'Meiryo', 'sans-serif'],
      },
      backgroundImage: {
        'header-gradient': 'linear-gradient(135deg, #4a6fa5, #2d4a73)',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.15)',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      screens: {
        'sp': '480px',
        'tab': '760px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}