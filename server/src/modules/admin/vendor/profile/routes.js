import express from 'express';

import validateSchema from '../../../../middleware/schema.validation.js';
import * as controller from './controller.js';
import * as schema from './schema.js';

const router = express.Router();

router.get(
  '/vendor/profile/application/:applicationId',
  validateSchema(schema.applicationId, 'params'),
  controller.getVendorProfileByApplicationId
);

router.get(
  '/vendor/profile/:vendorId',
  validateSchema(schema.vendorId, 'params'),
  controller.getVendorProfileById
);

export default router;
