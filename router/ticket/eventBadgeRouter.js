import express from "express";
import { createEventBadge, listEventBadge, updateEventBadge, deleteEventBadge, mobileEventBadge, } from "../../controller/ticket/eventBadgeController.js";
import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/mobile/event/badge/list", authenticated, mobileEventBadge);

router.get("/admin/event/badge/list", authenticated, isAdmin, listEventBadge);
router.post("/admin/event/badge/create", authenticated, isAdmin, createEventBadge);
router.put("/admin/event/badge/update/:id", authenticated, isAdmin, updateEventBadge);
router.delete("/admin/event/badge/delete/:id", authenticated, isAdmin, deleteEventBadge);



export default router;



