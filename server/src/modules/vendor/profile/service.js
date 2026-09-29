import { ERROR_CONFIG } from '../../../config/error.config.js';
import pool from '../../../infrastructure/database/db.js';
import ApiError from '../../../utils/api.error.js';
import { getPrivateUrl } from '../../../utils/r2.storage.js';
import { USER_ERROR_CONFIG } from '../../user/error.config.js';
import { VENDOR_ERROR_CONFIG } from '../error.config.js';
import { findVendorProfileById } from './repository.js';

export async function fetchVendorProfile(user, vendorId) {
  const result = await findVendorProfileById(pool, vendorId);

  if (!result) {
    throw new ApiError(VENDOR_ERROR_CONFIG.VENDOR_NOT_FOUND);
  }

  const { panDocumentKey, ...data } = result;

  return {
    ...user,
    ...data,
    panDocumentUrl: (await getPrivateUrl([result.panDocumentKey]))[0],
  };
}
