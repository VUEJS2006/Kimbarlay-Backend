import { sectionCreate, sectionList, sectionUpdate, sectionDelete, sectionMobileList } from "../../controller/TravelController/tourSectionController.js"
import express from "express";

import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.get('/mobile/tour/section/list', authenticated, sectionMobileList);

// Admin Site
router.post('/admin/tour/section/create', authenticated, isAdmin, sectionCreate)
router.get('/admin/tour/section/list', authenticated, isAdmin, sectionList);
router.put('/admin/tour/section/update/:id', authenticated, isAdmin, sectionUpdate)
router.delete('/admin/tour/section/delete/:id', authenticated, isAdmin, sectionDelete);
export default router;