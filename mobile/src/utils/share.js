import { Share } from 'react-native';

/** Opens the native share sheet. Never throws. */
export async function shareContent({ title, text, url }) {
  try {
    const message = [text, url].filter(Boolean).join('\n\n');
    await Share.share({ title: title || 'MPS', message });
  } catch {
    // user dismissed the share sheet
  }
}
