import { domesticHotelCreate, domesticHotelList, domesticHotelUpdate, domesticHotelDelete } from "../controller/domesticHotelController.js"
import express from "express";
import { upload } from "../middleware/upload.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
const router = express.Router()

// Dashboard Site
router.post('/admin/domestic/hotel/create', upload.single("image"), authenticated, isAdmin, domesticHotelCreate);
router.get('/admin/domestic/hotel/list', authenticated, isAdmin, domesticHotelList);
router.put('/admin/domestic/hotel/update/:id', upload.single("image"), authenticated, isAdmin, domesticHotelUpdate);
router.delete('/admin/domestic/hotel/delete/:id', authenticated, isAdmin, domesticHotelDelete);


// Website Site
router.get('/mobile/domestic/hotel/list', authenticated, isAdmin, domesticHotelList)
export default router;