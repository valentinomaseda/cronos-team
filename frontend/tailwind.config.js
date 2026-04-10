/** @type {import('tailwindcss').Config} */
const withAlpha = (variable) => ({ opacityValue }) => {
  if (opacityValue === undefined) return `rgb(var(${variable}))`;
  return `rgba(var(${variable}), ${opacityValue})`;
};

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        primary: withAlpha('--color-primary'),
        success: withAlpha('--color-success'),
        'text-dark': withAlpha('--color-text-dark'),
        background: withAlpha('--color-bg')
      },
      borderRadius: {
        md: 'var(--radius-md)'
      }
    }
  },
  plugins: []
};
