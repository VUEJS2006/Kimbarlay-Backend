import { interBannerList, interbannerCreate, interbannerUpdate, interbannerDelete, interbannerMobileList } from "../../controller/TravelController/internationalBannerController.js"
import express from "express";

import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.get('/mobile/international/banner/list', authenticated, interbannerMobileList);

// Admin Site
router.post('/admin/international/banner/create', upload.single("image"), authenticated, isAdmin, interbannerCreate)
router.get('/admin/international/banner/list', authenticated, isAdmin, interBannerList);
router.put('/admin/international/banner/update/:id', upload.single("image"), authenticated, isAdmin, interbannerUpdate)
router.delete('/admin/international/banner/delete/:id', authenticated, isAdmin, interbannerDelete);
export default router;