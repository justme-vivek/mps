const imagekit = require('../config/imagekit');

/**
 * Uploads a multer file (memory buffer) to ImageKit.
 * Returns { url, fileId, name, size } — fileId must be persisted with the
 * document so the asset can be deleted from ImageKit later.
 */
const uploadToImagekit = async (file, folder) => {
  const response = await imagekit.upload({
    file: file.buffer,
    fileName: `${Date.now()}-${file.originalname}`.replace(/\s+/g, '-'),
    folder,
    useUniqueFileName: true,
  });

  return {
    url: response.url,
    fileId: response.fileId,
    name: response.name,
    size: response.size,
  };
};

/**
 * Best-effort delete from ImageKit. Never throws — an orphaned asset in
 * ImageKit must not break the API response.
 */
const deleteFromImagekit = async (fileId) => {
  if (!fileId) return;
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.warn(`[imagekit] Failed to delete file ${fileId}: ${error.message}`);
  }
};

module.exports = { uploadToImagekit, deleteFromImagekit };
