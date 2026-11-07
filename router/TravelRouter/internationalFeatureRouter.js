import express from "express";
import {
    featureCreate,
    featureDelete,
    featureList,
    featureMobileList,
    featureUpdate
} from "../../controller/TravelController/internationalFeatureController.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/mobile/international/feature/list", authenticated, featureMobileList);

router.post(
    "/admin/international/feature/create",
    authenticated,
    isAdmin,
    featureCreate
);
router.get("/admin/international/feature/list", authenticated, isAdmin, featureList);
router.put("/admin/international/feature/update/:id", authenticated, isAdmin, featureUpdate);
router.delete("/admin/international/feature/delete/:id", authenticated, isAdmin, featureDelete);

export default router;
