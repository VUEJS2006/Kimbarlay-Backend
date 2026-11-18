import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createBusStep, deleteBusStep, getAllBusSteps, updateBusStep } from "../../controller/busAndBoat/busStepsController.js";

const busStepsRouter = express.Router();

busStepsRouter.get("/bus_steps/all" ,  getAllBusSteps )

busStepsRouter.post("/bus_steps" , authenticated , isAdmin ,  createBusStep )

busStepsRouter.put("/bus_steps" , authenticated , isAdmin ,  updateBusStep )

busStepsRouter.delete("/bus_steps/:id" , authenticated , isAdmin ,  deleteBusStep )


export default busStepsRouter;