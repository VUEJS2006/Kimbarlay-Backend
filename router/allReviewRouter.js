import { reviewCreate, reviewList, reviewDelete } from "../controller/reviewController.js"
import express from "express";
import { upload } from "../middleware/upload.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
const router = express.Router()

// User Site
router.post('/mobile/all/review/create', authenticated, upload.single("image"), reviewCreate);
router.get('/mobile/all/review/list', authenticated, reviewList);

export default router;