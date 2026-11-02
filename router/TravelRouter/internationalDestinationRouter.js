import { interCreate, interList, interUpdate, interDelete, interMobileList } from "../../controller/TravelController/internationalDestinationController.js"
import express from "express";

import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.get('/mobile/international/list', authenticated, interMobileList);

// Admin Site
router.post('/admin/international/create', authenticated, isAdmin, interCreate)
router.get('/admin/international/list', authenticated, isAdmin, interList);
router.put('/admin/international/update/:id', authenticated, isAdmin, interUpdate)
router.delete('/admin/international/delete/:id', authenticated, isAdmin, interDelete);
export default router;