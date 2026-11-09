import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createVisaPopularDestinations, deleteVisaPopularDestinations, getAllVisaPopularDestinations, updateVisaPopularDestinations } from "../../controller/TravelController/visaPopularDestinationsController.js";

const visaPopularDestinationsRouter = express.Router();

visaPopularDestinationsRouter.get("/visa_popular_destinations/all" ,  getAllVisaPopularDestinations )

visaPopularDestinationsRouter.post("/visa_popular_destinations" , authenticated , isAdmin ,  createVisaPopularDestinations )

visaPopularDestinationsRouter.put("/visa_popular_destinations" , authenticated , isAdmin ,  updateVisaPopularDestinations )

visaPopularDestinationsRouter.delete("/visa_popular_destinations/:id" , authenticated , isAdmin ,  deleteVisaPopularDestinations )
    

export default visaPopularDestinationsRouter;