import {
    overseaHotelCreate,
    overseaHotelList,
    overseaHotelUpdate,
    overseaHotelDelete
} from "../controller/overseaHotelController.js"
import express from "express";
import { upload } from "../middleware/upload.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";


const router = express.Router()

// Dashboard Site
router.post('/admin/oversea/hotel/create', upload.single("image"), authenticated, isAdmin, overseaHotelCreate);
router.get('/admin/oversea/hotel/list', authenticated, isAdmin, overseaHotelList);
router.put('/admin/oversea/hotel/update/:id', upload.single("image"), authenticated, isAdmin, overseaHotelUpdate);
router.delete('/admin/oversea/hotel/delete/:id', authenticated, isAdmin, overseaHotelDelete);

// Website Site
router.get('/mobile/oversea/hotel/list', authenticated, overseaHotelList)

export default router;
