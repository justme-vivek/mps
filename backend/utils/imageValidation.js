/**
 * Strict media allowlist — IMAGES and PDF only.
 * Every upload is validated by extension AND by sniffing magic bytes,
 * so a renamed .exe or .html can never pass as an image.
 */
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];

const MAGIC_CHECKS = [
  {
    ext: 'jpg',
    type: 'image',
    mime: 'image/jpeg',
    check: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    ext: 'jpeg',
    type: 'image',
    mime: 'image/jpeg',
    check: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    ext: 'png',
    type: 'image',
    mime: 'image/png',
    check: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  {
    ext: 'gif',
    type: 'image',
    mime: 'image/gif',
    check: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46,
  },
  {
    ext: 'webp',
    type: 'image',
    mime: 'image/webp',
    check: (b) =>
      b.slice(0, 4).toString('ascii') === 'RIFF' && b.slice(8, 12).toString('ascii') === 'WEBP',
  },
  {
    ext: 'pdf',
    type: 'pdf',
    mime: 'application/pdf',
    check: (b) => b.slice(0, 5).toString('ascii') === '%PDF-',
  },
];

const getExtension = (filename = '') =>
  (filename.includes('.') ? filename.split('.').pop() : '').toLowerCase();

const isAllowedExtension = (ext) => ALLOWED_EXTENSIONS.includes((ext || '').toLowerCase());

const detectFileType = (buffer) => MAGIC_CHECKS.find((m) => m.check(buffer)) || null;

/**
 * Validates an uploaded multer file:
 *  1. extension must be allowlisted
 *  2. content must sniff as an allowed image/PDF
 *  3. sniffed content must match the extension (blocks mismatch tricks)
 * Returns { ok, ext, type, mime } or { ok: false, error }.
 */
const validateUpload = (file) => {
  if (!file) return { ok: false, error: 'No file provided' };

  const ext = getExtension(file.originalname);
  if (!isAllowedExtension(ext)) {
    return {
      ok: false,
      error:
        'Files of type ".' + (ext || 'unknown') + '" are not allowed. Only images (jpg, jpeg, png, gif, webp) and PDF files are accepted.',
    };
  }

  const detected = detectFileType(file.buffer);
  if (!detected) {
    return { ok: false, error: 'File content is not a valid image or PDF' };
  }

  const extMatches = detected.ext === ext || (ext === 'jpg' && detected.ext === 'jpeg');
  if (!extMatches) {
    return { ok: false, error: 'File extension does not match its content' };
  }

  return { ok: true, ext: detected.ext, type: detected.type, mime: detected.mime };
};

module.exports = {
  ALLOWED_EXTENSIONS,
  getExtension,
  isAllowedExtension,
  detectFileType,
  validateUpload,
};
