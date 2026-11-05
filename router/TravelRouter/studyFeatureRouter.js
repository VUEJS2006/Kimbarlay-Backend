import express from "express";
import {
    featureCreate,
    featureDelete,
    featureList,
    featureMobileList,
    featureUpdate
} from "../../controller/TravelController/studyFeatureController.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const router = express.Router();

router.get("/mobile/study/feature/list", authenticated, featureMobileList);

router.post(
    "/admin/study/feature/create",
    authenticated,
    isAdmin,
    featureCreate
);
router.get("/admin/study/feature/list", authenticated, isAdmin, featureList);
router.put("/admin/study/feature/update/:id", authenticated, isAdmin, featureUpdate);
router.delete("/admin/study/feature/delete/:id", authenticated, isAdmin, featureDelete);

export default router;
