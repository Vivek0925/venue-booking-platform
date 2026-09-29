import pool from '../../../../infrastructure/database/db.js';
import toCamelCase from '../../../../utils/camelcase.conversion.js';

export async function fetchVendorProfileByApplicationId(applicationId) {
  const result = await pool.query(
    `SELECT
       vp.id,
       vp.vendor_name,
       vp.phone,
       vp.district,
       vp.state,
       vp.is_suspended,
       vp.suspension_reason,
       vp.approved_at,
       u.email,
       u.status AS account_status
     FROM vendor_profiles vp
     JOIN users u ON u.id = vp.user_id
     WHERE vp.application_id = $1
     LIMIT 1`,
    [applicationId]
  );

  return toCamelCase(result.rows[0]);
}

export async function fetchVendorProfileById(vendorId) {
  const result = await pool.query(
    `SELECT
       vp.id,
       vp.vendor_name,
       vp.phone,
       vp.district,
       vp.state,
       vp.is_suspended,
       vp.suspension_reason,
       vp.approved_at,
       u.email,
       u.status AS account_status
     FROM vendor_profiles vp
     JOIN users u ON u.id = vp.user_id
     WHERE vp.id = $1
     LIMIT 1`,
    [vendorId]
  );

  return toCamelCase(result.rows[0]);
}
