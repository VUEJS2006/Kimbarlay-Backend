import { hotelGuideCreate,hotelGuideList,hotelGuideUpdate,hotelGuideDelete } from "../controller/hotelGuideController.js"
import express from "express";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
const router = express.Router()

// Dashboard Site
router.post('/admin/hotel-guide/create', authenticated, isAdmin, hotelGuideCreate);
router.get('/admin/hotel-guide/list', authenticated, isAdmin, hotelGuideList);
router.put('/admin/hotel-guide/update/:id', authenticated, isAdmin, hotelGuideUpdate);
router.delete('/admin/hotel-guide/delete/:id', authenticated, isAdmin, hotelGuideDelete);


// Website Site
router.get('/mobile/hotel-guide/list', authenticated, hotelGuideList)
export default router;