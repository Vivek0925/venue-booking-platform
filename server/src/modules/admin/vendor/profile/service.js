import { pool } from '../../../../infrastructure/database/db.js';
import ApiError from '../../../../utils/api.error.js';
import { withTransaction } from '../../../../utils/transaction.js';
import { PROFILE_ERROR_CONFIG } from './error.config.js';
import * as repository from './repository.js';

export async function getVendorProfileByApplicationId(applicationId) {
  const vendor = await repository.fetchVenodrProfileByApplicationId(
    pool,
    applicationId
  );

  if (!vendor) {
    throw new ApiError(PROFILE_ERROR_CONFIG.VENDOR_NOT_FOUND);
  }
  return vendor;
}

export async function getVendorProfileById(vendorId) {
  const vendor = await repository.fetchVendorProfileById(vendorId);

  if (!vendor) {
    throw new ApiError(PROFILE_ERROR_CONFIG.VENDOR_NOT_FOUND);
  }
  return vendor;
}
