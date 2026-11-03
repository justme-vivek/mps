import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';

/** Downloads a remote PDF into the app cache and returns the local uri. */
export async function downloadPdf(url, filename) {
  const safeName = (filename || 'document.pdf').replace(/[^\w.\-]+/g, '-');
  const target = `${FileSystem.cacheDirectory}${safeName}`;
  const { uri } = await FileSystem.downloadAsync(url, target);
  return uri;
}

/** Opens the native share sheet for a local file uri. */
export async function sharePdf(uri) {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'MPS Download' });
  } else {
    await WebBrowser.openBrowserAsync(uri);
  }
}

export async function openInBrowser(url) {
  await WebBrowser.openBrowserAsync(url);
}
