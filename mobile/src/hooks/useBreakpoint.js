import { useWindowDimensions } from 'react-native';
import { layout } from '../theme/tokens';

/**
 * Responsive helper used by every screen.
 *  compact  < 768   phones: bottom tabs, single column
 *  medium   >= 768  tablets: two-column content, bottom tabs
 *  wide     >= 1024 laptops: top nav / permanent admin sidebar, 1200px column
 */
export function useBreakpoint() {
  const { width, height } = useWindowDimensions();
  const isMedium = width >= layout.medium;
  const isWide = width >= layout.expanded;
  return {
    width,
    height,
    isMedium,
    isWide,
    isCompact: !isMedium,
    gutter: isWide ? layout.marginXWide : layout.marginX,
    dateWidth: isMedium ? 76 : 64,
    columns: isWide ? 4 : isMedium ? 3 : 2,
  };
}
