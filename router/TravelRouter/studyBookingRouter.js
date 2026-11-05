import express from "express";
import {
    studyBookingApproved,
    studyBookingCancelled,
    studyBookingCreate,
    studyBookingList,
    studyBookingMobileList
} from "../../controller/TravelController/studyBookingController.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/admin/study/booking/list", authenticated, isAdmin, studyBookingList);
router.put("/admin/study/booking/approved/:id", authenticated, isAdmin, studyBookingApproved);
router.put("/admin/study/booking/cancelled/:id", authenticated, isAdmin, studyBookingCancelled);

router.get("/mobile/study/booking/list", authenticated, studyBookingMobileList);
router.post("/mobile/study/booking/create", authenticated, studyBookingCreate);

export default router;
