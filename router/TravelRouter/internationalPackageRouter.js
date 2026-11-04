import {
    interPackageCreate,
    interPackageList,
    interPackageUpdate,
    interPackageDelete,
    interPackageMobileList
} from "../../controller/TravelController/internationalPackageController.js";
import express from "express";
import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

// User Site
router.get('/mobile/international/package/list', authenticated, interPackageMobileList);

// Admin Site
router.post('/admin/international/package/create', upload.single("image"), authenticated, isAdmin, interPackageCreate);
router.get('/admin/international/package/list', authenticated, isAdmin, interPackageList);
router.put('/admin/international/package/update/:id', upload.single("image"), authenticated, isAdmin, interPackageUpdate);
router.delete('/admin/international/package/delete/:id', authenticated, isAdmin, interPackageDelete);

export default router;

