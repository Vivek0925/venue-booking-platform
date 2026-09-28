import * as service from './service.js';

export async function getVendorProfileByApplicationId(req, res) {
  const data = await service.getVendorProfileByApplicationId(
    req.params.applicationId
  );
  res.status(200).json({ status: true, data });
}

export async function getVendorProfileById(req, res) {
  const data = await service.getVendorProfileById(req.params.vendorId);
  res.status(200).json({ status: true, data });
}
