import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createBusLine, deleteBusLine, getAllBusLines, updateBusLine } from "../../controller/busAndBoat/busLinesController.js";

const busLinesRouter = express.Router();

busLinesRouter.get("/bus_lines/all" ,  getAllBusLines )

busLinesRouter.post("/bus_lines" , authenticated , isAdmin ,  createBusLine )

busLinesRouter.put("/bus_lines" , authenticated , isAdmin ,  updateBusLine )

busLinesRouter.delete("/bus_lines/:id" , authenticated , isAdmin ,  deleteBusLine )


export default busLinesRouter;