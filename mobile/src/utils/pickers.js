import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

/**
 * Picks a single image from the device library.
 * Returns an RN upload file { uri, name, type } or null when cancelled.
 */
export async function pickImage() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Photo library permission is required to pick images.');
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.85,
    allowsMultipleSelection: false,
  });
  if (result.canceled || !result.assets?.length) return null;
  const asset = result.assets[0];
  const name =
    asset.fileName && asset.fileName.includes('.')
      ? asset.fileName
      : `image-${Date.now()}.${asset.mimeType === 'image/png' ? 'png' : 'jpg'}`;
  return {
    uri: asset.uri,
    name,
    type: asset.mimeType || 'image/jpeg',
  };
}

/**
 * Picks a single PDF from the device.
 * Returns an RN upload file { uri, name, type, size } or null when cancelled.
 */
export async function pickPdf() {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/pdf',
    multiple: false,
    copyToCacheDirectory: true,
  });
  if (result.canceled || !result.assets?.length) return null;
  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.name || `document-${Date.now()}.pdf`,
    type: 'application/pdf',
    size: asset.size,
  };
}
