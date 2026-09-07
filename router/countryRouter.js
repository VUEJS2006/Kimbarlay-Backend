import { countryCreate, countryList, countryUpdate, countryDelete } from "../controller/countryController.js"
import exress from "express";

const router = exress.Router()

// Dashboard Site
router.post('/admin/country/create', countryCreate);
router.get('/admin/country/list', countryList);
router.put('/admin/country/update/:id', countryUpdate);
router.get('/admin/country/delete/:id', countryDelete);


// Website Site
router.get('/mobile/country/list', countryList)
export default router;