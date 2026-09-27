import toCamelCase from '../../../utils/camelcase.conversion.js';

export async function findVendorProfileById(client, vendorId) {
  const result = await client.query(
    `
    SELECT
      vp.vendor_name,
      vp.phone,
      vp.district,
      vp.state,
      vp.is_suspended,
      vp.suspension_reason,
      vp.approved_at,
      va.pan_document_key
    FROM vendor_profiles vp
    LEFT JOIN vendor_applications va
      ON va.user_id = vp.user_id
    WHERE va.status = 'approved'
      AND vp.id = $1;
    `,
    [vendorId]
  );

  return toCamelCase(result.rows[0]);
}
