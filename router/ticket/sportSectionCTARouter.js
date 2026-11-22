import express from "express";
import { createSportCTA, listSportCTA, updateSportCTA, deleteSportCTA } from "../../controller/ticket/sportCTAController.js";
import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { mobileEventCTA } from "../../controller/ticket/eventCTAController.js";

const router = express.Router();

router.get("/mobile/sport/cta/list", authenticated, mobileEventCTA);

router.get("/admin/sport/cta/list", authenticated, isAdmin, listSportCTA);
router.post("/admin/sport/cta/create", authenticated, isAdmin, createSportCTA);
router.put("/admin/sport/cta/update/:id", authenticated, isAdmin, updateSportCTA);
router.delete("/admin/sport/cta/delete/:id", authenticated, isAdmin, deleteSportCTA);



export default router;



