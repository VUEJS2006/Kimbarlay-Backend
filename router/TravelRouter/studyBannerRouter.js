import express from "express";
import {
    studybannerCreate,
    studybannerDelete,
    studybannerList,
    studybannerMobileList,
    studybannerUpdate
} from "../../controller/TravelController/studyBannerController.js";
import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/mobile/study/banner/list", authenticated, studybannerMobileList);

router.post(
    "/admin/study/banner/create",
    authenticated,
    isAdmin,
    upload.single("image"),
    studybannerCreate
);
router.get("/admin/study/banner/list", authenticated, isAdmin, studybannerList);
router.put(
    "/admin/study/banner/update/:id",
    authenticated,
    isAdmin,
    upload.single("image"),
    studybannerUpdate
);
router.delete("/admin/study/banner/delete/:id", authenticated, isAdmin, studybannerDelete);

export default router;
