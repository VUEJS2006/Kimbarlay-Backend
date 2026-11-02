import express from "express";
import {
    localSectionCreate,
    localSectionDelete,
    localSectionList,
    localSectionMobileList,
    localSectionUpdate
} from "../../controller/TravelController/localSectionController.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/mobile/tour/local/section/list", authenticated, localSectionMobileList);

router.post("/admin/tour/local/section/create", authenticated, isAdmin, localSectionCreate);
router.get("/admin/tour/local/section/list", authenticated, isAdmin, localSectionList);
router.put("/admin/tour/local/section/update/:id", authenticated, isAdmin, localSectionUpdate);
router.delete("/admin/tour/local/section/delete/:id", authenticated, isAdmin, localSectionDelete);

export default router;
