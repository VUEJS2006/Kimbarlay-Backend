import { tourDomesticCreate, tourDomesticDelete, tourDomesticList, tourDomesticMobileList, tourDomesticUpdate } from "../../controller/TravelController/tourDomesticController.js"
import express from "express";

import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.get('/mobile/tour/domestic/list', authenticated, tourDomesticMobileList);

// Admin Site
router.post('/admin/tour/domestic/create', upload.single("image"), authenticated, isAdmin, tourDomesticCreate)
router.get('/admin/tour/domestic/list', authenticated, isAdmin, tourDomesticList);
router.put('/admin/tour/domestic/update/:id', upload.single("image"), authenticated, isAdmin, tourDomesticUpdate)
router.delete('/admin/tour/domestic/delete/:id', authenticated, isAdmin, tourDomesticDelete);
export default router;

