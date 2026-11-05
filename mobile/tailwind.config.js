/**
 * "Diary" design system for MPS.
 * Token names are unchanged from the original theme so every screen picks up
 * the new look; only the values and font families are new.
 *
 *  paper   #F8FAFF   page background          (surface-alt)
 *  ink     #1B2A59   text, headers, hero      (ink / primary-700)
 *  pen     #2A44B8   links, primary buttons   (primary)
 *  margin  #D8432F   the red margin line only (margin)
 *  marker  #FFE066   highlighter for "new"    (accent)
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EDF1FF',
          100: '#DCE4F8',
          200: '#C9D3F0',
          500: '#4A63D0',
          600: '#2A44B8',
          700: '#1B2A59',
          900: '#111B3D',
          DEFAULT: '#2A44B8',
        },
        accent: {
          DEFAULT: '#FFE066',
          50: '#FFF8D6',
          100: '#FFF1BF',
          ink: '#6B4E00',
        },
        danger: {
          DEFAULT: '#B7311F',
          50: '#FDEDEA',
        },
        success: {
          DEFAULT: '#0F6B38',
          50: '#DDF3E6',
        },
        margin: '#D8432F',
        ink: {
          DEFAULT: '#1B2A59',
          soft: '#2F3F70',
          muted: '#4A5A8A',
          faint: '#56648F',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F8FAFF',
          sunken: '#EDF1FB',
        },
        line: '#C9D3F0',
      },
      fontFamily: {
        // Native custom fonts have one family name per weight.
        sans: ['AtkinsonHyperlegible_400Regular'],
        'sans-bold': ['AtkinsonHyperlegible_700Bold'],
        serif: ['YoungSerif_400Regular'],
      },
      borderRadius: {
        card: '20px',
        hero: '28px',
      },
    },
  },
  plugins: [],
};
