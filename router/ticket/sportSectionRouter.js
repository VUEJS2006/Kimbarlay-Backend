import express from "express";
import { sportSectionCreate, sportSectionList, sportSectionUpdate, sportSectionDelete, mobileSportSectionList } from "../../controller/ticket/sportSectionController.js";
import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/mobile/sport/section/list", authenticated, mobileSportSectionList);

router.get("/admin/sport/section/list", authenticated, isAdmin, sportSectionList);
router.post("/admin/sport/section/create", authenticated, isAdmin, sportSectionCreate);
router.put("/admin/sport/section/update/:id", authenticated, isAdmin, sportSectionUpdate);
router.delete("/admin/sport/section/delete/:id", authenticated, isAdmin, sportSectionDelete);



export default router;



