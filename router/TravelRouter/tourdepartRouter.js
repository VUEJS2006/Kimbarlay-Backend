import { departCreate, departList, departUpdate, departDelete, departMobileList } from "../../controller/TravelController/tourDepartController.js"
import express from "express";

import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.get('/mobile/tour/depart/list', authenticated, departMobileList);

// Admin Site
router.post('/admin/tour/depart/create', authenticated, isAdmin, departCreate)
router.get('/admin/tour/depart/list', authenticated, isAdmin, departList);
router.put('/admin/tour/depart/update/:id', authenticated, isAdmin, departUpdate)
router.delete('/admin/tour/depart/delete/:id', authenticated, isAdmin, departDelete);
export default router;