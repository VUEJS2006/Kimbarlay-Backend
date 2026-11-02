import { newfeedCreate, newfeedDelete, newfeedList, newfeedMobileList, newfeedUpdate } from "../../controller/TravelController/newfeedController.js"
import express from "express";

import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.get('/mobile/newfeed/list', authenticated, newfeedMobileList);

// Admin Site
router.post('/admin/newfeed/create', authenticated, isAdmin, newfeedCreate)
router.get('/admin/newfeed/list', authenticated, isAdmin, newfeedList);
router.put('/admin/newfeed/update/:id', authenticated, isAdmin, newfeedUpdate)
router.delete('/admin/newfeed/delete/:id', authenticated, isAdmin, newfeedDelete);
export default router;