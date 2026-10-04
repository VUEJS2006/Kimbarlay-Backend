import { townshipCreate, townshipList, townshipUpdate, townshipDelete } from "../controller/townshipController.js"
import express from "express";
import { isAdmin, authenticated } from "../middleware/authenticatedMiddleware.js";

const router = express.Router()
// Dashboard Site
router.post('/admin/township/create', authenticated, isAdmin, townshipCreate);
router.get('/admin/township/list', authenticated, isAdmin, townshipList);
router.put('/admin/township/update/:id', authenticated, isAdmin, townshipUpdate);
router.delete('/admin/township/delete/:id', authenticated, isAdmin, townshipDelete);


// Website Site
router.get('/mobile/township/list', authenticated, townshipList)
export default router;