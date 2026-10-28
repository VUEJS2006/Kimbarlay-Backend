import { bannerCreate, bannerList, bannerUpdate, bannerDelete, bannerMobileList } from "../../controller/TravelController/tourBannerController.js"
import express from "express";

import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.get('/mobile/tour/banner/list', authenticated, bannerMobileList);

// Admin Site
router.post('/admin/tour/banner/create', upload.single("image"), authenticated, isAdmin, bannerCreate)
router.get('/admin/tour/banner/list', authenticated, isAdmin, bannerList);
router.put('/admin/tour/banner/update/:id', upload.single("image"), authenticated, isAdmin, bannerUpdate)
router.delete('/admin/tour/banner/delete/:id', authenticated, isAdmin, bannerDelete);
export default router;