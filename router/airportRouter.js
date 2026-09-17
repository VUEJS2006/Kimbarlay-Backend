import express from "express"
import { upload } from "../middleware/upload.js";
import { createAirport, deleteAirport, getAirport, getAllForAirfare, updateAirport } from "../controller/airportController.js";

const airportRouter = express.Router();

// app start take all rows of 4 tables / requested from frontend
airportRouter.get("/airfare/getall" , getAllForAirfare )

// get airports from both admin and user
airportRouter.get("/airports" , getAirport )

// creating each airport
airportRouter.post("/admin/airport/create" , upload.single("image") , createAirport )

// updating each airport
airportRouter.put("/admin/airport/update" , upload.single("image") , updateAirport )

// delete each airport 
airportRouter.delete('/admin/airport/delete/:id' , deleteAirport)

export default airportRouter;