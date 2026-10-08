import { guideCreate, guideList, guideMobileList, guideUpdate, guideDelete, guideDetails } from "../controller/guideController.js"
import express from "express";
import { upload } from "../middleware/upload.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
const router = express.Router()

const guideImageFields = [
    { name: "images", maxCount: 6 },
    ...Array.from({ length: 6 }, (_, index) => ({
        name: `image${index + 1}`,
        maxCount: 1
    }))
];

// Dashboard Site
router.post('/admin/guide/create', authenticated, isAdmin, upload.fields(guideImageFields), guideCreate);
router.get('/admin/guide/list', authenticated, isAdmin, guideList);
// router.put('/admin/guide/update/:id', authenticated, isAdmin, upload.fields(guideImageFields), guideUpdate);
router.put('/admin/guide/update/:id', authenticated, isAdmin, upload.any() , guideUpdate);
router.delete('/admin/guide/delete/:id', authenticated, isAdmin, guideDelete);


// Website Site
router.get('/mobile/guide/list', authenticated, guideMobileList)
router.get('/mobile/guide/details/:id', authenticated, guideDetails)
export default router;