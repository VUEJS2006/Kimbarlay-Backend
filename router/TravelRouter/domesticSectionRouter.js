import express from "express";
import {
    domesticSectionCreate,
    domesticSectionDelete,
    domesticSectionList,
    domesticSectionMobileList,
    domesticSectionUpdate
} from "../../controller/TravelController/domesticSectionController.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/mobile/tour/domestic/section/list", authenticated, domesticSectionMobileList);

router.post("/admin/tour/domestic/section/create", authenticated, isAdmin, domesticSectionCreate);
router.get("/admin/tour/domestic/section/list", authenticated, isAdmin, domesticSectionList);
router.put("/admin/tour/domestic/section/update/:id", authenticated, isAdmin, domesticSectionUpdate);
router.delete("/admin/tour/domestic/section/delete/:id", authenticated, isAdmin, domesticSectionDelete);

export default router;
