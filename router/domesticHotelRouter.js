import { domesticHotelCreate, domesticHotelList, domesticHotelUpdate, domesticHotelDelete } from "../controller/domesticHotelController.js"
import exress from "express";

const router = exress.Router()

// Dashboard Site
router.post('/admin/domestic/hotel/create', domesticHotelCreate);
router.get('/admin/domestic/hotel/list', domesticHotelList);
router.put('/admin/domestic/hotel/update/:id', domesticHotelUpdate);
router.get('/admin/domestic/hotel/delete/:id', domesticHotelDelete);


// Website Site
router.get('/mobile/domestic/hotel/list', domesticHotelList)
export default router;