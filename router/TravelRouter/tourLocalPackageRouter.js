import { LocalpackageCreate, LocalpackageList, LocalpackageUpdate, LocalpackageDelete, LocalpackageMobileList } from "../../controller/TravelController/tourLocalPackageController.js"
import express from "express";

import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.get('/mobile/local/package/list', authenticated, LocalpackageMobileList);

// Admin Site
router.post('/admin/local/package/create', authenticated, isAdmin, LocalpackageCreate)
router.get('/admin/local/package/list', authenticated, isAdmin, LocalpackageList);
router.put('/admin/local/package/update/:id', authenticated, isAdmin, LocalpackageUpdate)
router.delete('/admin/local/package/delete/:id', authenticated, isAdmin, LocalpackageDelete);
export default router;