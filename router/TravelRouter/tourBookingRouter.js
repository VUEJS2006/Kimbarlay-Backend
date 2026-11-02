import { tourBookingCreate, tourBookingList, tourBookingApproved, tourBookingCancelled, tourBookingMobileList } from "../../controller/TravelController/tourBookingController.js";
import express from "express";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router()

// Dashboard Site

router.get('/admin/tour/booking/list', authenticated, isAdmin, tourBookingList);
router.put('/admin/tour/booking/approved/:id', authenticated, isAdmin, tourBookingApproved);
router.put('/admin/tour/booking/cancelled/:id', authenticated, isAdmin, tourBookingCancelled);

// Website Site
router.get('/mobile/tour/booking/list', authenticated, tourBookingMobileList)
router.post('/mobile/tour/booking/create', authenticated, tourBookingCreate);
export default router;