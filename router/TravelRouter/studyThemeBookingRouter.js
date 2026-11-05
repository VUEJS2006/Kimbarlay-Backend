import express from "express";
import {
    studyThemeBookingApproved,
    studyThemeBookingCancelled,
    studyThemeBookingCreate,
    studyThemeBookingList,
    studyThemeBookingMobileList
} from "../../controller/TravelController/studyThemeBookingController.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get(
    "/admin/study/theme/booking/list",
    authenticated,
    isAdmin,
    studyThemeBookingList
);
router.put(
    "/admin/study/theme/booking/approved/:id",
    authenticated,
    isAdmin,
    studyThemeBookingApproved
);
router.put(
    "/admin/study/theme/booking/cancelled/:id",
    authenticated,
    isAdmin,
    studyThemeBookingCancelled
);

router.get(
    "/mobile/study/theme/booking/list",
    authenticated,
    studyThemeBookingMobileList
);
router.post(
    "/mobile/study/theme/booking/create",
    authenticated,
    studyThemeBookingCreate
);

export default router;
