import { fetchVendorProfile } from './service.js';

export default async function getVendorProfile(req, res) {
  const data = await fetchVendorProfile(req.user, req.vendor.id);
  res.status(200).json({
    success: true,
    data,
  });
}
