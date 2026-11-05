import React from 'react';
import { Text as RNText } from 'react-native';

const BOLD = /\bfont-(medium|semibold|bold|extrabold|black)\b/g;

/**
 * Drop-in replacement for react-native's Text that applies the Diary fonts.
 *
 * Custom fonts on native have one family per weight, so the usual
 * `font-bold` classes cannot switch weight. This component maps every bold-ish
 * class to the bold family and everything else to the regular family, and
 * strips the weight class so Android does not add faux bold on top.
 * `font-serif` (Young Serif, single weight) is left alone.
 */
const Text = React.forwardRef(function Text({ className = '', ...props }, ref) {
  let family = 'font-sans';
  let cleaned = className;
  if (/\bfont-serif\b/.test(className)) {
    family = '';
    cleaned = cleaned.replace(BOLD, '');
  } else if (BOLD.test(className)) {
    BOLD.lastIndex = 0;
    family = 'font-sans-bold';
    cleaned = cleaned.replace(BOLD, '');
  }
  BOLD.lastIndex = 0;
  return <RNText ref={ref} className={`${family} ${cleaned}`.trim()} {...props} />;
});

export default Text;
