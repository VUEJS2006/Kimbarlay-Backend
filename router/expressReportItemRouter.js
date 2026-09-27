import express from "express"
import { upload } from "../middleware/upload.js";
import { createExpressReportItem, deleteExpressReportItem, getAllExpressReportItem, updateExpressReportItem } from "../controller/expressReportItemController.js";
import { authencated, isAdmin } from "../middleware/authenticatedMiddleware.js";

const expressReportItemsRouter = express.Router();

expressReportItemsRouter.get("/promo/category/items" , getAllExpressReportItem)

expressReportItemsRouter.post("/promo/category/item/create" , upload.single("image") , authencated , isAdmin , createExpressReportItem )

expressReportItemsRouter.put("/promo/category/item/update" , upload.single("image") , authencated , isAdmin , updateExpressReportItem)

expressReportItemsRouter.delete("/promo/category/item/delete/:id" , authencated , isAdmin , deleteExpressReportItem)

export default expressReportItemsRouter;