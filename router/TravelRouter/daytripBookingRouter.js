import express from "express";
import {
    dayBookingApproved,
    dayBookingCancelled,
    dayBookingCreate,
    dayBookingList,
    dayBookingMobileList
} from "../../controller/TravelController/daytripBookingController.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/admin/day-trip/booking/list", authenticated, isAdmin, dayBookingList);
router.put("/admin/day-trip/booking/approved/:id", authenticated, isAdmin, dayBookingApproved);
router.put("/admin/day-trip/booking/cancelled/:id", authenticated, isAdmin, dayBookingCancelled);

router.get("/mobile/day-trip/booking/list", authenticated, dayBookingMobileList);
router.post("/mobile/day-trip/booking/create", authenticated, dayBookingCreate);

export default router;
