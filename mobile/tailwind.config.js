/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
          DEFAULT: '#4F46E5',
        },
        accent: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
        },
        danger: {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
        },
        success: {
          DEFAULT: '#16A34A',
          50: '#F0FDF4',
        },
        ink: {
          DEFAULT: '#111827',
          soft: '#374151',
          muted: '#6B7280',
          faint: '#9CA3AF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F9FAFB',
          sunken: '#F3F4F6',
        },
        line: '#E5E7EB',
      },
    },
  },
  plugins: [],
};
