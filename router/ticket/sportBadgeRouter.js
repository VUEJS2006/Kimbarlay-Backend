import express from "express";
import { createSportBadge, listSportBadge, updateSportBadge, deleteSportBadge, mobileSportBadge } from "../../controller/ticket/sportBadgeController.js";
import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/mobile/sport/badge/list", authenticated, mobileSportBadge);

router.get("/admin/sport/badge/list", authenticated, isAdmin, listSportBadge);
router.post("/admin/sport/badge/create", authenticated, isAdmin, createSportBadge);
router.put("/admin/sport/badge/update/:id", authenticated, isAdmin, updateSportBadge);
router.delete("/admin/sport/badge/delete/:id", authenticated, isAdmin, deleteSportBadge);



export default router;





