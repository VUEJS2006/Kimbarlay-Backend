import express from "express";
import { eventSectionCreate, eventSectionDelete, eventSectionList, eventSectionUpdate, mobileEventSectionMobilList } from "../../controller/ticket/eventSectionController.js";
import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/mobile/event/section/list", authenticated, mobileEventSectionMobilList);

router.get("/admin/event/section/list", authenticated, isAdmin, eventSectionList);
router.post("/admin/event/section/create", authenticated, isAdmin, eventSectionCreate);
router.put("/admin/event/section/update/:id", authenticated, isAdmin, eventSectionUpdate);
router.delete("/admin/event/section/delete/:id", authenticated, isAdmin, eventSectionDelete);



export default router;



