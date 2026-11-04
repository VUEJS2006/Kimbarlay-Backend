import express from "express";
import {
    dayBannerCreate,
    dayBannerDelete,
    dayBannerList,
    dayBannerMobileList,
    dayBannerUpdate
} from "../../controller/TravelController/daytripBannerController.js";
import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/mobile/day-trip/banner/list", dayBannerMobileList);

router.post(
    "/admin/day-trip/banner/create",
    authenticated,
    isAdmin,
    upload.single("image"),
    dayBannerCreate
);
router.get("/admin/day-trip/banner/list", authenticated, isAdmin, dayBannerList);
router.put(
    "/admin/day-trip/banner/update/:id",
    authenticated,
    isAdmin,
    upload.single("image"),
    dayBannerUpdate
);
router.delete("/admin/day-trip/banner/delete/:id", authenticated, isAdmin, dayBannerDelete);

export default router;
