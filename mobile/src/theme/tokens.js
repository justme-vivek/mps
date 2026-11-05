/**
 * Diary design tokens for places Tailwind classes cannot reach
 * (icon colours, navigation options, StatusBar, RefreshControl).
 * Keep in sync with tailwind.config.js.
 */
export const colors = {
  paper: '#F8FAFF',
  surface: '#FFFFFF',
  sunken: '#EDF1FB',
  ink: '#1B2A59',
  inkSoft: '#2F3F70',
  inkMuted: '#4A5A8A',
  inkFaint: '#56648F',
  pen: '#2A44B8',
  penSoft: '#EDF1FF',
  line: '#C9D3F0',
  margin: '#D8432F',
  marker: '#FFE066',
  danger: '#B7311F',
  success: '#0F6B38',
  white: '#FFFFFF',
};

export const fonts = {
  sans: 'AtkinsonHyperlegible_400Regular',
  sansBold: 'AtkinsonHyperlegible_700Bold',
  serif: 'YoungSerif_400Regular',
};

/** Content column and breakpoints used by every screen. */
export const layout = {
  maxContentWidth: 1200,
  medium: 768, // tablets: two-column content
  expanded: 1024, // laptops: top nav / permanent admin sidebar
  sidebarWidth: 248,
  marginX: 20, // phone gutter
  marginXWide: 24,
};
