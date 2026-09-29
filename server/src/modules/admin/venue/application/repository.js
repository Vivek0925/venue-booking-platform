import pool from '../../../../infrastructure/database/db.js';
import toCamelCase from '../../../../utils/camelcase.conversion.js';

export async function fetchApplicationsCounts() {
  const result = await pool.query(`
    SELECT
      COUNT(*) AS total_applications,
      COUNT(*) FILTER (WHERE status = 'pending') AS pending,
      COUNT(*) FILTER (WHERE status = 'approved') AS approved,
      COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
    FROM (
      SELECT DISTINCT ON (venue_application_group_id)
        venue_application_group_id,
        status
      FROM venue_applications
      ORDER BY venue_application_group_id, submitted_at DESC
    ) AS latest_application_count_per_group
  `);

  return toCamelCase(result.rows[0]);
}

export async function fetchApplications(status) {
  const result = await pool.query(
    `
    SELECT * FROM (
      SELECT DISTINCT ON (venue_application_group_id)
        id, name, category, district, state, status, cover_image_key, submitted_at
      FROM venue_applications
      ORDER BY venue_application_group_id, submitted_at DESC
    ) AS latest_per_group
    WHERE status = $1
    ORDER BY submitted_at ASC
    `,
    [status]
  );
  return result.rows.map((row) => toCamelCase(row));
}

export async function fetchApplication(applicationId) {
  const result = await pool.query(
    `
    SELECT
      va.id,
      va.name,
      va.category,
      va.venue_details,
      va.address,
      va.district,
      va.pincode,
      va.state,
      ST_Y(va.geo_loc::geometry) AS latitude,
      ST_X(va.geo_loc::geometry) AS longitude,
      va.images,
      va.proof_document_key,
      va.rejection_reason,
      va.submitted_at,
      va.reviewed_at,
      va.status,
      vp.id AS vendor_id,
      vp.vendor_name
    FROM venue_applications va
    JOIN vendor_profiles vp
      ON vp.id = va.vendor_id
    WHERE va.id = $1
    `,
    [applicationId]
  );

  return toCamelCase(result.rows[0]);
}

export async function markVenueAsRejected(reviewerId, applicationId, data) {
  const result = await pool.query(
    `
    WITH updated AS (
      UPDATE venue_applications
      SET
        status = 'rejected',
        rejection_reason = $1,
        reviewed_at = NOW(),
        reviewed_by = $2
      WHERE id = $3
        AND status = 'pending'
      RETURNING
        id,
        vendor_id,
        name AS venue_name,
        rejection_reason
    )
    SELECT
      updated.*,
      vp.vendor_name,
      u.email
    FROM updated
    JOIN vendor_profiles vp
      ON vp.id = updated.vendor_id
    JOIN users u
      ON u.id = vp.user_id
    `,
    [data.rejectionReason, reviewerId, applicationId]
  );
  return toCamelCase(result.rows[0]);
}

export async function markVenueAsApproved(client, reviewerId, applicationId) {
  const result = await client.query(
    `
    WITH updated AS (
      UPDATE venue_applications
      SET
        status = 'approved',
        reviewed_at = NOW(),
        reviewed_by = $1
      WHERE id = $2
        AND status = 'pending'
      RETURNING
        id,
        vendor_id,
        name,
        category,
        address,
        district,
        state,
        pincode,
        geo_loc
    )
    SELECT
      updated.*,
      vp.vendor_name,
      u.email AS vendor_email
    FROM updated
    JOIN vendor_profiles vp
      ON vp.id = updated.vendor_id
    JOIN users u
      ON u.id = vp.user_id
    `,
    [reviewerId, applicationId]
  );
  return toCamelCase(result.rows[0]);
}

export async function createVenue(client, data) {
  const result = await client.query(
    `
    INSERT INTO venues (vendor_id, application_id, name, category, address, district, state, pincode, geo_loc)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::geography)
    RETURNING id
    `,
    [
      data.vendorId,
      data.id,
      data.name,
      data.category,
      data.address,
      data.district,
      data.state,
      data.pincode,
      data.geoLoc,
    ]
  );
  return result.rows[0];
}
