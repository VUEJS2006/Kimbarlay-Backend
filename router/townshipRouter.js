import { townshipCreate, townshipList, townshipUpdate, townshipDelete } from "../controller/townshipController.js"
import exress from "express";
import { isAdmin, authencated } from "../middleware/authenticatedMiddleware.js";

const router = exress.Router()
// Dashboard Site
router.post('/admin/township/create', authencated, isAdmin, townshipCreate);
router.get('/admin/township/list', authencated, isAdmin, townshipList);
router.put('/admin/township/update/:id', authencated, isAdmin, townshipUpdate);
router.delete('/admin/township/delete/:id', authencated, isAdmin, townshipDelete);


// Website Site
router.get('/mobile/township/list', authencated, townshipList)
export default router;