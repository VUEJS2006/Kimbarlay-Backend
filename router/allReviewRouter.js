import { allReviewCreate, allReviewList } from "../controller/allReviewController.js"
import express from "express";
import { upload } from "../middleware/upload.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.post('/mobile/all/review/create', authenticated, upload.single("image"), allReviewCreate);
router.get('/mobile/all/review/list', authenticated, allReviewList);

export default router;