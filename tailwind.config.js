import colors from './src/styles/themes/color.mjs';
import typography from './src/styles/themes/typography.mjs';
import spacing from './src/styles/themes/spacing.mjs';

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors,
      typography,
      fontSize: {},
      space: spacing,
      spacing: {
        15: '60px',
      },
      minWidth: {},
    },
  },
  presets: [require('nativewind/preset')],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './modules/**/*.{js,jsx,ts,tsx}',
  ],
  plugins: [],
};
