import { packageCreate,packageList,packageUpdate,packageDelete,packageMobileList } from "../../controller/TravelController/tourPackageController.js"
import express from "express";

import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.get('/mobile/tour/package/list', authenticated, packageMobileList);

// Admin Site
router.post('/admin/tour/package/create', authenticated, isAdmin, packageCreate)
router.get('/admin/tour/package/list', authenticated, isAdmin, packageList);
router.put('/admin/tour/package/update/:id', authenticated, isAdmin, packageUpdate)
router.delete('/admin/tour/package/delete/:id', authenticated, isAdmin, packageDelete);
export default router;