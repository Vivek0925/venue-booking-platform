import pool from '../../infrastructure/database/db.js';

export async function findVendorId(userId) {
  const result = await pool.query(
    `
    SELECT id, is_suspended FROM vendor_profiles
    WHERE user_id = $1 `,
    [userId]
  );
  return result.rows[0] ?? null;
}
