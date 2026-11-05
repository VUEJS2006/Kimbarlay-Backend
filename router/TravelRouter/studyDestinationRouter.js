import express from "express";
import {
    studydestinationCreate,
    studydestinationDelete,
    studydestinationList,
    studydestinationMobileList,
    studydestinationUpdate
} from "../../controller/TravelController/studyDestinationController.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { upload } from "../../middleware/upload.js";

const router = express.Router();

router.get("/mobile/study/destination/list", authenticated, studydestinationMobileList);

router.post(
    "/admin/study/destination/create",
    authenticated,
    isAdmin,
    upload.single("image"),
    studydestinationCreate
);
router.get("/admin/study/destination/list", authenticated, isAdmin, studydestinationList);
router.put(
    "/admin/study/destination/update/:id",
    authenticated,
    isAdmin,
    upload.single("image"),
    studydestinationUpdate
);
router.delete(
    "/admin/study/destination/delete/:id",
    authenticated,
    isAdmin,
    studydestinationDelete
);

export default router;
