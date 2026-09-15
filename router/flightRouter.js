import express from "express";
import { createFlight, deleteFlight, getFlights, updateFlight } from "../controller/flightController.js";

const flightRouter = express.Router();

flightRouter.get("/admin/flights" , getFlights )

flightRouter.post("/admin/flight/create" , createFlight );

flightRouter.put("/admin/flight/update" , updateFlight);

flightRouter.delete('/admin/flight/delete/:id' , deleteFlight)


export default flightRouter;
