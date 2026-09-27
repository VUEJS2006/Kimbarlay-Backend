import express from "express"
import { createExpressReportCategory, deleteExpressReportCategory, getExpressReportCategories, updateExpressReportCategory } from "../controller/expressReportCategoryController.js";
import { upload } from "../middleware/upload.js";
import { authencated, isAdmin } from "../middleware/authenticatedMiddleware.js";

const expressReportCategoriesRouter = express.Router();

expressReportCategoriesRouter.get("/promo/categories" , getExpressReportCategories)

expressReportCategoriesRouter.post("/promo/category/create" , upload.single("icon") , authencated , isAdmin , createExpressReportCategory )

expressReportCategoriesRouter.put("/promo/category/update" , upload.single("icon") , authencated , isAdmin , updateExpressReportCategory)

expressReportCategoriesRouter.delete("/promo/category/delete/:id" , authencated , isAdmin ,  deleteExpressReportCategory)

export default expressReportCategoriesRouter;