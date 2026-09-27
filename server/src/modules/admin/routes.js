import express from 'express';

import validateAdminSession from './auth/middleware.js';
import adminAuthRoutes from './auth/routes.js';
import adminVendorApplicationRoutes from './vendor/application/routes.js';
import adminProfileRoutes from './vendor/profile/routes.js';
import adminVenueApplicationRoutes from './venue/application/routes.js';

const router = express.Router();

router.use(adminAuthRoutes);
router.use(validateAdminSession);
router.use(adminVendorApplicationRoutes);
router.use(adminProfileRoutes);
router.use(adminVenueApplicationRoutes);

export default router;
