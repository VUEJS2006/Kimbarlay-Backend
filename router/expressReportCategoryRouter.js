import express from "express"
import { createExpressReportCategory, deleteExpressReportCategory, getExpressReportCategories, updateExpressReportCategory } from "../controller/expressReportCategoryController.js";
import { upload } from "../middleware/upload.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";

const expressReportCategoriesRouter = express.Router();

expressReportCategoriesRouter.get("/promo/categories", getExpressReportCategories)

// expressReportCategoriesRouter.post("/promo/category/create" , upload.single("icon") , authenticated , isAdmin , createExpressReportCategory )

// expressReportCategoriesRouter.put("/promo/category/update" , upload.single("icon") , authenticated , isAdmin , updateExpressReportCategory)

// expressReportCategoriesRouter.delete("/promo/category/delete/:id" , authenticated , isAdmin ,  deleteExpressReportCategory)

expressReportCategoriesRouter.post("/promo/category/create", upload.single("icon"), createExpressReportCategory)

expressReportCategoriesRouter.put("/promo/category/update", upload.single("icon"), updateExpressReportCategory)

expressReportCategoriesRouter.delete("/promo/category/delete/:id", deleteExpressReportCategory)

export default expressReportCategoriesRouter;