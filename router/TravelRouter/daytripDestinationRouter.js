import { daydestinationCreate, daydestinationList, daydestinationUpdate, daydestinationDelete, daydestinationMobileList } from "../../controller/TravelController/daytripDestinationController.js"
import express from "express";

import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.get('/mobile/day-trip/destination/list', authenticated, daydestinationMobileList);

// Admin Site
router.post('/admin/day-trip/destination/create', upload.single("image"), authenticated, isAdmin, daydestinationCreate)
router.get('/admin/day-trip/destination/list', authenticated, isAdmin, daydestinationList);
router.put('/admin/day-trip/destination/update/:id', upload.single("image"), authenticated, isAdmin, daydestinationUpdate)
router.delete('/admin/day-trip/destination/delete/:id', authenticated, isAdmin, daydestinationDelete);
export default router;

