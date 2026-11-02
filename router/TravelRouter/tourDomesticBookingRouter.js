import { tourDomesticBookingApproved, tourDomesticBookingCancelled, tourDomesticBookingCreate, tourDomesticBookingList, tourDomesticBookingMobileList } from "../../controller/TravelController/tourDomesticBookingController.js";
import express from "express";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router()

// Dashboard Site

router.get('/admin/tour/domestic/booking/list', authenticated, isAdmin, tourDomesticBookingList);
router.put('/admin/tour/domestic/booking/approved/:id', authenticated, isAdmin, tourDomesticBookingApproved);
router.put('/admin/tour/domestic/booking/cancelled/:id', authenticated, isAdmin, tourDomesticBookingCancelled);

// Website Site
router.get('/mobile/tour/domestic/booking/list', authenticated, tourDomesticBookingMobileList)
router.post('/mobile/tour/domestic/booking/create', authenticated, tourDomesticBookingCreate);
export default router;