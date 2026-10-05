import express from "express";
import { createRescheduleRequest, deleteReschedule, getRescheduleRequests, updateRescheduleRequest, updateRescheduleStatus } from "../controller/rescheduleRequestController.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";


const rescheduleRequestRouter = express.Router();

rescheduleRequestRouter.get("/reschedules", getRescheduleRequests)

rescheduleRequestRouter.post("/reschedule/request" , authenticated, createRescheduleRequest)

rescheduleRequestRouter.put("/reschedule/update/:id" , authenticated, updateRescheduleRequest)

rescheduleRequestRouter.patch("/reschedule/change/status/:id" , authenticated, isAdmin, updateRescheduleStatus)

rescheduleRequestRouter.delete("/reschedule/:id" , authenticated , deleteReschedule)

export default rescheduleRequestRouter;