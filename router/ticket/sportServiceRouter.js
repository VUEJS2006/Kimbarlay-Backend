import express from "express";
import {

    createSportService, listSportService, updateSportService, deleteSportService, mobileSportService

} from "../../controller/ticket/sportServiceController.js";
import { upload } from "../../middleware/upload.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/mobile/sport/service/list", authenticated, mobileSportService);

router.get("/admin/sport/service/list", authenticated, isAdmin, listSportService);
router.post("/admin/sport/service/create", authenticated, isAdmin, createSportService);
router.put("/admin/sport/service/update/:id", authenticated, isAdmin, updateSportService);
router.delete("/admin/sport/service/delete/:id", authenticated, isAdmin, deleteSportService);



export default router;



