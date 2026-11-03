const multer = require('multer');
const { isAllowedExtension, getExtension, validateUpload } = require('../utils/imageValidation');

// Memory storage → files arrive as Buffers and are forwarded straight to ImageKit
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max per file
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const ext = getExtension(file.originalname);
    if (!isAllowedExtension(ext)) {
      return cb(new Error('INVALID_FILE_TYPE'));
    }
    cb(null, true);
  },
});

/**
 * Runs AFTER multer on any media route: sniffs the magic bytes of req.file
 * and rejects anything that is not a genuine image/PDF. Attachments are
 * optional on most routes (controllers decide), so an absent file passes.
 */
const validateFile = (req, res, next) => {
  if (!req.file) return next();

  const result = validateUpload(req.file);
  if (!result.ok) {
    return res.status(400).json({ message: result.error });
  }

  req.file.meta = { ext: result.ext, type: result.type, mime: result.mime };
  next();
};

module.exports = upload;
module.exports.validateFile = validateFile;

