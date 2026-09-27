import { randomUUID } from 'crypto';
import path from 'path';

import { pool } from '../../../../infrastructure/database/db.js';
import ApiError from '../../../../utils/api.error.js';
import { deleteFromR2, uploadToR2 } from '../../../../utils/r2.storage.js';
import { withTransaction } from '../../../../utils/transaction.js';
import ERROR_CONFIG from './error.config.js';
import { findVenueGroupId, insertIntoVenueApplications } from './repository.js';

export async function submitApplication(vendorId, data, files) {
  const proofDocument = files.proofDocument[0];
  const coverImage = files.coverImage[0];

  const proofDocumentKey = `venue-applications/${vendorId}/${Date.now()}-venueProof${path.extname(proofDocument.originalname)}`;
  const coverImageKey = `venue-applications/${vendorId}/${Date.now()}-venueCoverImage${path.extname(coverImage.originalname)}`;
  const venueImagesKeys = files.venueImages.map((image, index) => {
    return `venue-applications/${vendorId}/${Date.now()}-venueImage${index}${path.extname(image.originalname)}`;
  });

  const uploads = [
    { key: proofDocumentKey, file: proofDocument },
    { key: coverImageKey, file: coverImage },
    ...files.venueImages.map((image, index) => ({
      key: venueImagesKeys[index],
      file: image,
    })),
  ];
  const uploadedKeys = uploads.map((u) => u.key);

  try {
    await Promise.all(
      uploads.map(({ key, file }) =>
        uploadToR2(file.buffer, key, file.mimetype)
      )
    );

    let venueGroupId;
    if (data.venueGroupId) {
      const result = await findVenueGroupId(vendorId, data.venueGroupId);

      if (!result || result.venueGroupId) {
        throw new ApiError(ERROR_CONFIG.NO_EXISTING_VENUE_FOUND);
      }
      venueGroupId = result.venueGroupId;
    } else {
      venueGroupId = randomUUID();
    }

    return insertIntoVenueApplications({
      ...data,
      vendorId,
      venueGroupId,
      images: venueImagesKeys,
      proofDocumentKey,
      coverImageKey,
    });
  } catch (err) {
    for (const key of uploadedKeys) {
      await deleteFromR2(key);
    }
    throw err;
  }
}
