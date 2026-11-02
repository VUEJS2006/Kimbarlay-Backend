import { tourLocalBookingApproved, tourLocalBookingCancelled, tourLocalBookingCreate, tourLocalBookingList, tourLocalBookingMobileList } from "../../controller/TravelController/tourLocalBookingController.js";
import express from "express";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router()

// Dashboard Site

router.get('/admin/tour/local/booking/list', authenticated, isAdmin, tourLocalBookingList);
router.put('/admin/tour/local/booking/approved/:id', authenticated, isAdmin, tourLocalBookingApproved);
router.put('/admin/tour/local/booking/cancelled/:id', authenticated, isAdmin, tourLocalBookingCancelled);

// Website Site
router.get('/mobile/tour/local/booking/list', authenticated, tourLocalBookingMobileList)
router.post('/mobile/tour/local/booking/create', authenticated, tourLocalBookingCreate);
export default router;