import express from "express";
import {
    dayPackageCreate,
    dayPackageList,
    dayPackageUpdate,
    dayPackageDelete,
    
    dayPackageMobileList
} from "../../controller/TravelController/daytripPackageController.js";
import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

// User Site
router.get("/mobile/day-trip/package/list", authenticated, dayPackageMobileList);

// Admin Site
router.post(
    "/admin/day-trip/package/create",
    upload.single("image"),
    authenticated,
    isAdmin,
    dayPackageCreate
);
router.get("/admin/day-trip/package/list", authenticated, isAdmin, dayPackageList);
router.put(
    "/admin/day-trip/package/update/:id",
    upload.single("image"),
    authenticated,
    isAdmin,
    dayPackageUpdate
);
router.delete("/admin/day-trip/package/delete/:id", authenticated, isAdmin, dayPackageDelete);

export default router;
