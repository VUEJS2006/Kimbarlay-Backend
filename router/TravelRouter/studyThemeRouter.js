import express from "express";
import {
    themeCreate,
    themeDelete,
    themeList,
    themeMobileList,
    themeUpdate
} from "../../controller/TravelController/studyThemeController.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { upload } from "../../middleware/upload.js";

const router = express.Router();

router.get("/mobile/study/theme/list", authenticated, themeMobileList);

router.post(
    "/admin/study/theme/create",
    authenticated,
    isAdmin,
    upload.single("image"),
    themeCreate
);
router.get("/admin/study/theme/list", authenticated, isAdmin, themeList);
router.put(
    "/admin/study/theme/update/:id",
    authenticated,
    isAdmin,
    upload.single("image"),
    themeUpdate
);
router.delete("/admin/study/theme/delete/:id", authenticated, isAdmin, themeDelete);

export default router;
