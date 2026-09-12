import { townshipCreate, townshipList, townshipUpdate, townshipDelete } from "../controller/townshipController.js"
import exress from "express";

const router = exress.Router()

// Dashboard Site
router.post('/admin/township/create', townshipCreate);
router.get('/admin/township/list', townshipList);
router.put('/admin/township/update/:id', townshipUpdate);
router.delete('/admin/township/delete/:id', townshipDelete);


// Website Site
router.get('/mobile/township/list', townshipList)
export default router;