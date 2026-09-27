import express from "express"
import { upload } from "../middleware/upload.js";
import { createAirport, deleteAirport, getAirport, getAllForAirfare, updateAirport } from "../controller/airportController.js";
import { authencated, isAdmin } from "../middleware/authenticatedMiddleware.js";

const airportRouter = express.Router();

// app start take all rows of 4 tables / requested from frontend
airportRouter.get("/airfare/getall" , getAllForAirfare )

// get airports from both admin and user
airportRouter.get("/airports" , getAirport )

// creating each airport
airportRouter.post("/admin/airport/create" , upload.single("image") , authencated , isAdmin , createAirport )

// updating each airport
airportRouter.put("/admin/airport/update" , upload.single("image") , authencated , isAdmin , updateAirport )

// delete each airport 
airportRouter.delete('/admin/airport/delete/:id' , authencated , isAdmin , deleteAirport)

export default airportRouter;