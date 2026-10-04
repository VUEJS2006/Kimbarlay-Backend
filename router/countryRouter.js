import { countryCreate, countryList, countryUpdate, countryDelete } from "../controller/countryController.js"
import express from "express";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
const router = express.Router()

// Dashboard Site
router.post('/admin/country/create', authenticated, isAdmin, countryCreate);
router.get('/admin/country/list', authenticated, isAdmin, countryList);
router.put('/admin/country/update/:id', authenticated, isAdmin, countryUpdate);
router.delete('/admin/country/delete/:id', authenticated, isAdmin, countryDelete);


// Website Site
router.get('/mobile/country/list', authenticated, countryList)
export default router;