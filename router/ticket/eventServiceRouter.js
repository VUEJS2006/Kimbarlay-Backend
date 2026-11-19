import express from "express";
import {

    createEventService, listEventService, updateEventService, deleteEventService, mobileEventService

} from "../../controller/ticket/eventServiceController.js";
import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/mobile/event/service/list", authenticated, mobileEventService);

router.get("/admin/event/service/list", authenticated, isAdmin, listEventService);
router.post("/admin/event/service/create", authenticated, isAdmin, createEventService);
router.put("/admin/event/service/update/:id", authenticated, isAdmin, updateEventService);
router.delete("/admin/event/service/delete/:id", authenticated, isAdmin, deleteEventService);



export default router;



