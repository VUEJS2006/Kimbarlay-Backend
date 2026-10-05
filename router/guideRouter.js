import { guideCreate, guideList, guideUpdate, guideDelete, guideDetails } from "../controller/guideController.js"
import express from "express";
import { upload } from "../middleware/upload.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
const router = express.Router()

// Dashboard Site
router.post('/admin/guide/create', authenticated, isAdmin, upload.array("images", 6), guideCreate);
router.get('/admin/guide/list', authenticated, isAdmin, guideList);
router.put('/admin/guide/update/:id', authenticated, isAdmin, upload.array("images", 6), guideUpdate);
router.delete('/admin/guide/delete/:id', authenticated, isAdmin, guideDelete);


// Website Site
router.get('/mobile/guide/list', authenticated, guideList)
router.get('/mobile/guide/details/:id', authenticated, guideDetails)
export default router;