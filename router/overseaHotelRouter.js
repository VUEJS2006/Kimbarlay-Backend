import {
    overseaHotelCreate,
    overseaHotelList,
    overseaHotelUpdate,
    overseaHotelDelete
} from "../controller/overseaHotelController.js"
import express from "express";
import { upload } from "../middleware/upload.js";

const router = express.Router()

// Dashboard Site
router.post('/admin/oversea/hotel/create', upload.single("image"), overseaHotelCreate);
router.get('/admin/oversea/hotel/list', overseaHotelList);
router.put('/admin/oversea/hotel/update/:id', upload.single("image"), overseaHotelUpdate);
router.delete('/admin/oversea/hotel/delete/:id', overseaHotelDelete);

// Website Site
router.get('/mobile/oversea/hotel/list', overseaHotelList)

export default router;
