import express from 'express';

import upload from '../../../middleware/file.upload.js';
import { validateFileType } from '../../../middleware/file.validation.js';
import validateSchema from '../../../middleware/schema.validation.js';
import { authenticateToken, ensureAccountActive } from '../auth/middleware.js';
import * as controller from './controller.js';
import schema from './schema.js';

const router = express.Router();

router.use(authenticateToken, ensureAccountActive);

router.get('/application/status', controller.getApplicationStatus);

router.post(
  '/application',
  upload(1, 7).single('panDocument'),
  validateFileType,
  validateSchema(schema),
  controller.submitApplication
);

export default router;
