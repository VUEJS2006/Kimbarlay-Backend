import { countryCreate, countryList, countryUpdate, countryDelete } from "../controller/countryController.js"
import exress from "express";
import { authencated, isAdmin } from "../middleware/authenticatedMiddleware.js";
const router = exress.Router()

// Dashboard Site
router.post('/admin/country/create', authencated, isAdmin, countryCreate);
router.get('/admin/country/list', authencated, isAdmin, countryList);
router.put('/admin/country/update/:id', authencated, isAdmin, countryUpdate);
router.delete('/admin/country/delete/:id', authencated, isAdmin, countryDelete);


// Website Site
router.get('/mobile/country/list', authencated, countryList)
export default router;