import express from "express"
import { upload } from "../middleware/upload.js";
import { createAirline, deleteAirline, getAirlines, updateAirline } from "../controller/airlineController.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
import { imageErrorHandlingMiddleware } from "../middleware/imageErrorHandleMiddleware.js";

const airlineRouter = express.Router();

// get airlines from both admin and user
airlineRouter.get("/airlines", getAirlines)



airlineRouter.post("/admin/airline/create", upload.single("logo"), imageErrorHandlingMiddleware , authenticated, isAdmin, createAirline)

// updating each airline
airlineRouter.put("/admin/airline/update", upload.single("logo") , imageErrorHandlingMiddleware , authenticated, isAdmin, updateAirline)

// delete each airline 
airlineRouter.delete('/admin/airline/delete/:id', authenticated, isAdmin, deleteAirline)



export default airlineRouter;