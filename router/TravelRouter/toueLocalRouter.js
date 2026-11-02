import { tourLocalCreate, tourLocalList, tourLocalUpdate, tourLocalDelete, tourLocalMobileList } from "../../controller/TravelController/tourLocalController.js"
import express from "express";

import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.get('/mobile/tour/local/list', authenticated, tourLocalMobileList);

// Admin Site
router.post('/admin/tour/local/create', upload.single("image"), authenticated, isAdmin, tourLocalCreate)
router.get('/admin/tour/local/list', authenticated, isAdmin, tourLocalList);
router.put('/admin/tour/local/update/:id', upload.single("image"), authenticated, isAdmin, tourLocalUpdate)
router.delete('/admin/tour/local/delete/:id', authenticated, isAdmin, tourLocalDelete);
export default router;

