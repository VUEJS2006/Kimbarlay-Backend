import { domesticBookingDelete,domesticBookingCreate, domesticBookingList, domesticBookingApproved, domesticBookingCancelled, domesticBookingMobileList } from "../controller/domesticBookingController.js"
import express from "express";
import { upload } from "../middleware/upload.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
const router = express.Router()

// Dashboard Site

router.get('/admin/domestic/booking/list', authenticated, isAdmin, domesticBookingList);
router.put('/admin/domestic/booking/approved/:id', authenticated, isAdmin, domesticBookingApproved);
router.put('/admin/domestic/booking/cancelled/:id', authenticated, isAdmin, domesticBookingCancelled);
router.delete('/admin/domestic/booking/delete/:id', authenticated, isAdmin, domesticBookingDelete);

// Website Site
router.get('/mobile/domestic/booking/list', authenticated, domesticBookingMobileList)
router.post('/mobile/domestic/booking/create', authenticated, domesticBookingCreate);
export default router;