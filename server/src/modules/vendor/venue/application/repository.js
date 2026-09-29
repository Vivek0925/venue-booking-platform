import { pool } from '../../../../infrastructure/database/db.js';
import toCamelCase from '../../../../utils/camelcase.conversion.js';

export async function findVenueApplicationGroupId(
  vendorId,
  venueApplicationGroupId
) {
  const result = await pool.query(
    `
  SELECT venue_application_group_id FROM venue_applications
  WHERE vendor_id = $1 AND venue_application_group_id = $2 AND status = 'rejected'`,
    [vendorId, venueApplicationGroupId]
  );
  return toCamelCase(result.rows[0]);
}

export async function insertIntoVenueApplications(data) {
  const result = await pool.query(
    `
      INSERT INTO venue_applications (
        vendor_id,
        venue_application_group_id,
        name,
        venue_details,
        category,
        address,
        district,
        state,
        pincode,
        geo_loc,
        images,
        proof_document_key,
        cover_image_key
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        ST_SetSRID(ST_MakePoint($11, $10), 4326)::geography,
        $12,
        $13,
        $14
      )
      RETURNING id
    `,
    [
      data.vendorId,
      data.venueApplicationGroupId,
      data.name,
      data.venueDetails,
      data.category,
      data.address,
      data.district,
      data.state,
      data.pincode,
      data.latitude,
      data.longitude,
      data.images,
      data.proofDocumentKey,
      data.coverImageKey,
    ]
  );

  return toCamelCase(result.rows[0]);
}
