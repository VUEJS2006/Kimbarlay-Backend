import express from "express"
import { createExpressReportCategory, deleteExpressReportCategory, getExpressReportCategories, updateExpressReportCategory } from "../controller/expressReportCategoryController.js";
import { upload } from "../middleware/upload.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
import { imageErrorHandlingMiddleware } from "../middleware/imageErrorHandleMiddleware.js";

const expressReportCategoriesRouter = express.Router();

expressReportCategoriesRouter.get("/promo/categories", getExpressReportCategories)

expressReportCategoriesRouter.post("/promo/category/create", upload.single("icon"), imageErrorHandlingMiddleware , authenticated, isAdmin, createExpressReportCategory)

expressReportCategoriesRouter.put("/promo/category/update", upload.single("icon"), imageErrorHandlingMiddleware , authenticated, isAdmin, updateExpressReportCategory)

expressReportCategoriesRouter.delete("/promo/category/delete/:id", authenticated, isAdmin, deleteExpressReportCategory)

export default expressReportCategoriesRouter;