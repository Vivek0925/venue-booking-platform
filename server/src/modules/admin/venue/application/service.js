import pool from '../../../../infrastructure/database/db.js';
import ApiError from '../../../../utils/api.error.js';
import { getPrivateUrl } from '../../../../utils/r2.storage.js';
import { withTransaction } from '../../../../utils/transaction.js';
import {
  sendVenueApprovalMail,
  sendVenueRejectionMail,
} from '../../email.service.js';
import { APPLICATION_ERROR_CONFIG } from './error.config.js';
import * as repository from './repository.js';

export async function getApplicationsCounts() {
  return repository.fetchApplicationsCounts();
}

export async function getApplications(status) {
  const applications = await repository.fetchApplications(status);
  return Promise.all(
    applications.map(async (application) => {
      let { coverImageKey, ...data } = application;
      const [coverImage] = await getPrivateUrl([coverImageKey]);

      return {
        ...data,
        coverImage,
      };
    })
  );
}

export async function getApplication(applicationId) {
  const application = await repository.fetchApplication(applicationId);

  if (!application) {
    throw new ApiError(APPLICATION_ERROR_CONFIG.VENUE_APPLICATION_NOT_FOUND);
  }

  const { proofDocumentKey, images: imageKeys, ...data } = application;

  const [proofDocument, ...images] = await getPrivateUrl([
    proofDocumentKey,
    ...imageKeys,
  ]);

  return {
    ...data,
    proofDocument,
    images,
  };
}

export async function reviewApplication(reviewerId, applicationId, data) {
  if (data.status === 'rejected') {
    return handleRejection(reviewerId, applicationId, data);
  }
  return handleApproval(reviewerId, applicationId);
}

async function handleRejection(reviewerId, applicationId, data) {
  const emailInfo = await repository.markVenueAsRejected(
    reviewerId,
    applicationId,
    data
  );

  if (!emailInfo) {
    throw new ApiError(APPLICATION_ERROR_CONFIG.APPLICATION_NOT_PENDING);
  }

  try {
    await sendVenueRejectionMail(emailInfo);
  } catch (err) {
    console.log('Failed to send venue rejection mail', err);
  }
}

async function handleApproval(reviewerId, applicationId) {
  const emailInfo = await withTransaction(pool, async (client) => {
    const result = await repository.markVenueAsApproved(
      client,
      reviewerId,
      applicationId
    );

    if (!result) {
      throw new ApiError(APPLICATION_ERROR_CONFIG.APPLICATION_NOT_PENDING);
    }

    const venue = await repository.createVenue(client, result);
    return {
      email: result.email,
      vendorName: result.vendorName,
      venueName: venue.name,
    };
  });

  try {
    await sendVenueApprovalMail(emailInfo);
  } catch (err) {
    console.log('Failed to send venue apprroval mail', err);
  }
}
