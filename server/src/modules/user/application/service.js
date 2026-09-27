import path from 'path';

import { pool } from '../../../infrastructure/database/db.js';
import ApiError from '../../../utils/api.error.js';
import { deleteFromR2, uploadToR2 } from '../../../utils/r2.storage.js';
import { withTransaction } from '../../../utils/transaction.js';
import { USER_ERROR_CONFIG } from '../error.config.js';
import * as repository from './repository.js';

export async function getApplicationStatus(userId) {
  const application = await repository.fetchLatestApplicationStatus(userId);

  if (!application) {
    return { applicationStatus: 'not_applied' };
  }

  return application;
}

export async function submitApplication(userId, data, file) {
  const application = await repository.fetchLatestApplicationStatus(userId);

  if (application && application.status !== 'rejected') {
    throw new ApiError(USER_ERROR_CONFIG.APPLICATION_ALREADY_EXISTS);
  }

  const fileExtension = path.extname(file.originalname);
  const documentKey = `vendor-applications/${userId}/${Date.now()}-pan${fileExtension}`;
  let upload = false;
  try {
    await uploadToR2(file.buffer, documentKey, file.mimetype);
    upload = true;
    return await withTransaction(pool, async (client) => {
      return await repository.insertVendorApplication(client, {
        userId,
        ...data,
        documentKey,
      });
    });
  } catch (err) {
    if (upload) {
      await deleteFromR2(documentKey);
    }
    if (err.code === '23505') {
      throw new ApiError(USER_ERROR_CONFIG.APPLICATION_ALREADY_EXISTS);
    }
    throw err;
  }
}
