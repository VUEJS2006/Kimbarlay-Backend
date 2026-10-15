import { overseaBookingCreate, overseaBookingList, overseaBookingApproved, overseaBookingCancelled, overseaBookingDelete, overseaBookingMobileList } from "../controller/overseaBookingController.js"
import express from "express";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
const router = express.Router()

// Dashboard Site

router.get('/admin/oversea/booking/list', authenticated, isAdmin, overseaBookingList);
router.put('/admin/oversea/booking/approved/:id', authenticated, isAdmin, overseaBookingApproved);
router.put('/admin/oversea/booking/cancelled/:id', authenticated, isAdmin, overseaBookingCancelled);
router.delete('/admin/oversea/booking/delete/:id', authenticated, isAdmin, overseaBookingDelete);

// Website Site
router.get('/mobile/oversea/booking/list', authenticated, overseaBookingMobileList)
router.post('/mobile/oversea/booking/create', authenticated, overseaBookingCreate);
export default router;