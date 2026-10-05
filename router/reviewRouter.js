import { reviewCreate, reviewList, reviewDelete } from "../controller/reviewController.js"
import express from "express";
import { upload } from "../middleware/upload.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.post('/mobile/review/create', upload.single("image"), authenticated, reviewCreate);
router.get('/mobile/review/list', authenticated, reviewList);

// Admin Site
router.get('/admin/review/list', authenticated, isAdmin, reviewList)
router.delete('/admin/review/delete/:id', authenticated, isAdmin, reviewDelete);
export default router;