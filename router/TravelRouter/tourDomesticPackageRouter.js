import { DomesticpackageCreate, DomesticpackageList, DomesticpackageDelete, DomesticpackageUpdate, DomesticpackageMobileList } from "../../controller/TravelController/tourDomesticPackageController.js"
import express from "express";

import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.get('/mobile/domestic/package/list', authenticated, DomesticpackageMobileList);

// Admin Site
router.post('/admin/domestic/package/create', authenticated, isAdmin, DomesticpackageCreate)
router.get('/admin/domestic/package/list', authenticated, isAdmin, DomesticpackageList);
router.put('/admin/domestic/package/update/:id', authenticated, isAdmin, DomesticpackageUpdate)
router.delete('/admin/domestic/package/delete/:id', authenticated, isAdmin, DomesticpackageDelete);
export default router;