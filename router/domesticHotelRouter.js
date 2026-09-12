import { domesticHotelCreate, domesticHotelList, domesticHotelUpdate, domesticHotelDelete } from "../controller/domesticHotelController.js"
import exress from "express";
import { upload } from "../middleware/upload.js";
const router = exress.Router()

// Dashboard Site
router.post('/admin/domestic/hotel/create', upload.single("image"), domesticHotelCreate);
router.get('/admin/domestic/hotel/list', domesticHotelList);
router.put('/admin/domestic/hotel/update/:id', upload.single("image"), domesticHotelUpdate);
router.delete('/admin/domestic/hotel/delete/:id', domesticHotelDelete);


// Website Site
router.get('/mobile/domestic/hotel/list', domesticHotelList)
export default router;