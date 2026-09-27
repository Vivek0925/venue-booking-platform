import { pool } from '../../../../infrastructure/database/db.js';
import toCamelCase from '../../../../utils/camelcase.conversion.js';

export async function fetchApplicationsCounts() {
  const result = await pool.query(
    `SELECT 
    COUNT (*) AS total_applications,
    COUNT(*)  FILTER (WHERE status = 'pending') AS pending,
    COUNT(*) FILTER (WHERE status = 'approved') AS approved,
    COUNT(*) FILTER (WHERE status = 'rejected') AS rejected 
    FROM (
    SELECT DISTINCT ON (user_id)
    user_id, status
    FROM vendor_applications 
    ORDER BY user_id, submitted_at DESC) AS latest_application_count_per_user`
  );

  return toCamelCase(result.rows[0]);
}

export async function fetchApplicationsByStatus(client, status) {
  const result = await client.query(
    `SELECT 
        id,
        pan_name, 
        phone, 
        address,
        pincode, 
        district, 
        state, 
        pan_number, 
        pan_document_key,
        status,
        submitted_at,
        rejection_reason,
        reviewed_at
      FROM vendor_applications
      WHERE status = $1
      ORDER BY submitted_at DESC`,
    [status]
  );
  return result.rows.map((row) => toCamelCase(row));
}

export async function markVendorAsApproved(client, data) {
  const result = await client.query(
    `UPDATE vendor_applications
     SET status = 'approved',
         reviewed_at = NOW(),
         reviewed_by = $1
     WHERE id = $2
       AND status = 'pending'
     RETURNING
       id,
       user_id,
       pan_name,
       phone,
       district,
       state`,
    [data.reviewedBy, data.applicationId]
  );

  return toCamelCase(result.rows[0]);
}

export async function createVendorProfile(client, data) {
  await client.query(
    `INSERT INTO vendor_profiles(application_id, user_id, vendor_name, phone, district, state)
      VALUES ($1, $2, $3, $4, $5, $6)`,
    [data.id, data.userId, data.panName, data.phone, data.district, data.state]
  );
}

export async function markUserAsVendor(client, id) {
  const result = await client.query(
    `
      UPDATE users 
      SET role = 'vendor'
      WHERE id = $1 
      RETURNING email`,
    [id]
  );

  return result.rows[0]?.email ?? null;
}

export async function markVendorAsRejected(client, data) {
  const result = await client.query(
    `WITH rejected_application AS (
       UPDATE vendor_applications
       SET status = 'rejected',
           rejection_reason = $1,
           reviewed_at = NOW(),
           reviewed_by = $2
       WHERE id = $3
         AND status = 'pending'
       RETURNING id, user_id, pan_name, rejection_reason
     )
     SELECT rejected_application.id,
            rejected_application.pan_name,
            rejected_application.rejection_reason,
            users.email
     FROM rejected_application
     JOIN users ON users.id = rejected_application.user_id`,
    [data.rejectionReason, data.reviewerId, data.applicationId]
  );

  return toCamelCase(result.rows[0]);
}
