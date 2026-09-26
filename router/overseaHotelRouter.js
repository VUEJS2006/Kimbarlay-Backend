import {
    overseaHotelCreate,
    overseaHotelList,
    overseaHotelUpdate,
    overseaHotelDelete
} from "../controller/overseaHotelController.js"
import express from "express";
import { upload } from "../middleware/upload.js";
import { authencated,isAdmin } from "../middleware/authenticatedMiddleware.js";


const router = express.Router()

// Dashboard Site
router.post('/admin/oversea/hotel/create', upload.single("image"),authencated,isAdmin, overseaHotelCreate);
router.get('/admin/oversea/hotel/list', authencated,isAdmin,overseaHotelList);
router.put('/admin/oversea/hotel/update/:id', upload.single("image"), authencated,isAdmin,overseaHotelUpdate);
router.delete('/admin/oversea/hotel/delete/:id', authencated,isAdmin,overseaHotelDelete);

// Website Site
router.get('/mobile/oversea/hotel/list', authencated,overseaHotelList)

export default router;
