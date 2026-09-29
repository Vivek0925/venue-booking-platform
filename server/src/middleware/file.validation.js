import { fileTypeFromBuffer } from 'file-type';

import { ERROR_CONFIG } from '../config/error.config.js';
import ApiError from '../utils/api.error.js';

export async function validateFileType(req, res, next) {
  if (!req.file && !req.files) {
    throw new ApiError(ERROR_CONFIG.FILE_REQUIRED);
  }

  if (req.file) {
    await validateFileBuffer(req.file);
  }

  if (req.files) {
    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        await validateFileBuffer(file);
      }
    } else {
      for (const files of Object.values(req.files)) {
        for (const file of files) {
          await validateFileBuffer(file);
        }
      }
    }
  }
  next();
}

async function validateFileBuffer(file) {
  const type = await fileTypeFromBuffer(file.buffer);

  if (!type) {
    throw new ApiError(ERROR_CONFIG.INVALID_FILE_CONTENT);
  }

  const allowedTypes = ['image/jpeg', 'image/png'];

  if (!allowedTypes.includes(type.mime)) {
    throw new ApiError(ERROR_CONFIG.FILE_TYPE_MISMATCH);
  }
}
