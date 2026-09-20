import express from "express"
import { upload } from "../middleware/upload.js";
import { createExpressReportItem, deleteExpressReportItem, getAllExpressReportItem, updateExpressReportItem } from "../controller/expressReportItemController.js";

const expressReportItemsRouter = express.Router();

expressReportItemsRouter.get("/promo/category/items" , getAllExpressReportItem)

expressReportItemsRouter.post("/promo/category/item/create" , upload.single("image") , createExpressReportItem )

expressReportItemsRouter.put("/promo/category/item/update" , upload.single("image") , updateExpressReportItem)

expressReportItemsRouter.delete("/promo/category/item/delete/:id" , deleteExpressReportItem)

export default expressReportItemsRouter;