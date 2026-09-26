import { domesticHotelCreate, domesticHotelList, domesticHotelUpdate, domesticHotelDelete } from "../controller/domesticHotelController.js"
import exress from "express";
import { upload } from "../middleware/upload.js";
import { authencated, isAdmin } from "../middleware/authenticatedMiddleware.js";
const router = exress.Router()

// Dashboard Site
router.post('/admin/domestic/hotel/create', upload.single("image"), authencated, isAdmin, domesticHotelCreate);
router.get('/admin/domestic/hotel/list', authencated, isAdmin, domesticHotelList);
router.put('/admin/domestic/hotel/update/:id', upload.single("image"), authencated, isAdmin, domesticHotelUpdate);
router.delete('/admin/domestic/hotel/delete/:id', authencated, isAdmin, domesticHotelDelete);


// Website Site
router.get('/mobile/domestic/hotel/list', authencated, isAdmin, domesticHotelList)
export default router;