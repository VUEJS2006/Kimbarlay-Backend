import express from "express"
import { upload } from "../middleware/upload.js";
import { createAirline, deleteAirline, getAirlines, updateAirline } from "../controller/airlineController.js";

const airlineRouter = express.Router();

// get airlines from both admin and user
airlineRouter.get("/airlines" , getAirlines  )

// creating each airline
airlineRouter.post("/admin/airline/create" , upload.single("logo") , createAirline )

// updating each airline
airlineRouter.put("/admin/airline/update" , upload.single("logo") , updateAirline )

// delete each airline 
airlineRouter.delete('/admin/airline/delete/:id' , deleteAirline )

export default airlineRouter;