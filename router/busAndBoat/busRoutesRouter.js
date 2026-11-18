import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createBusRoute, deleteBusRoute, getAllBusRoutes, updateBusRoute } from "../../controller/busAndBoat/busRoutesController.js";

const busRoutesRouter = express.Router();

busRoutesRouter.get("/bus_routes/all" ,  getAllBusRoutes )

busRoutesRouter.post("/bus_routes" , authenticated , isAdmin ,  createBusRoute )

busRoutesRouter.put("/bus_routes" , authenticated , isAdmin ,  updateBusRoute )

busRoutesRouter.delete("/bus_routes/:id" , authenticated , isAdmin ,  deleteBusRoute )


export default busRoutesRouter;