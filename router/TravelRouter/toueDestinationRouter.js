import { destinationCreate, destinationList, destinationUpdate, destinationDelete, destinationMobileList } from "../../controller/TravelController/tourDestinationController.js"
import express from "express";

import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.get('/mobile/tour/destination/list', authenticated, destinationMobileList);

// Admin Site
router.post('/admin/tour/destination/create', upload.single("image"), authenticated, isAdmin, destinationCreate)
router.get('/admin/tour/destination/list', authenticated, isAdmin, destinationList);
router.put('/admin/tour/destination/update/:id', upload.single("image"), authenticated, isAdmin, destinationUpdate)
router.delete('/admin/tour/destination/delete/:id', authenticated, isAdmin, destinationDelete);
export default router;