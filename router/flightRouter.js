import express from "express";
import { createFlight, deleteFlight, getFlights, getSearchFlightsWithRelatedData, updateFlight } from "../controller/flightController.js";
import { authencated, isAdmin } from "../middleware/authenticatedMiddleware.js";

const flightRouter = express.Router();

flightRouter.get("/flights/search" , getSearchFlightsWithRelatedData)

flightRouter.get("/admin/flights" , getFlights )

// flightRouter.post("/admin/flight/create" , authencated , isAdmin , createFlight );

// flightRouter.put("/admin/flight/update" , authencated , isAdmin , updateFlight);

// flightRouter.delete('/admin/flight/delete/:id' , authencated , isAdmin , deleteFlight)


flightRouter.post("/admin/flight/create"  , createFlight );

flightRouter.put("/admin/flight/update", updateFlight);

flightRouter.delete('/admin/flight/delete/:id', deleteFlight)

export default flightRouter;
