import express from "express";
import { createEventCTA, listEventCTA, updateEventCTA, deleteEventCTA, mobileEventCTA } from "../../controller/ticket/eventCTAController.js";
import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/mobile/event/cta/list", authenticated, mobileEventCTA);

router.get("/admin/event/cta/list", authenticated, isAdmin, listEventCTA);
router.post("/admin/event/cta/create", authenticated, isAdmin, createEventCTA);
router.put("/admin/event/cta/update/:id", authenticated, isAdmin, updateEventCTA);
router.delete("/admin/event/cta/delete/:id", authenticated, isAdmin, deleteEventCTA);



export default router;



