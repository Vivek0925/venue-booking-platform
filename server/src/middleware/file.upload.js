import multer from 'multer';
import path from 'path';

import { ERROR_CONFIG } from '../config/error.config.js';
import ApiError from '../utils/api.error.js';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png'];

export default function upload(files, fields) {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
      files,
      fields,
    },
    fileFilter: (req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const validExtension = ALLOWED_EXTENSIONS.includes(extension);
      const validMimeType = ALLOWED_MIMETYPES.includes(file.mimetype);

      if (validExtension && validMimeType) {
        return cb(null, true);
      }

      cb(new ApiError(ERROR_CONFIG.FILE_TYPE_MISMATCH));
    },
  });
}
