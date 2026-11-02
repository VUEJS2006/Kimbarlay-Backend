import { interBookingApproved, interBookingCancelled, interBookingCreate, interBookingList, interBookingMobileList } from "../../controller/TravelController/interBookingController.js";
import express from "express";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router()

// Dashboard Site

router.get('/admin/inter/booking/list', authenticated, isAdmin, interBookingList);
router.put('/admin/inter/booking/approved/:id', authenticated, isAdmin, interBookingApproved);
router.put('/admin/inter/booking/cancelled/:id', authenticated, isAdmin, interBookingCancelled);

// Website Site
router.get('/mobile/inter/booking/list', authenticated, interBookingMobileList)
router.post('/mobile/inter/booking/create', authenticated, interBookingCreate);
export default router;