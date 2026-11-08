import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createVisaServices, deleteVisaServices, getAllVisaServices, updateVisaServices } from "../../controller/TravelController/visaServicesController.js";

const visaServicesRouter = express.Router();

visaServicesRouter.get("/visa_services/all" ,  getAllVisaServices )

visaServicesRouter.post("/visa_services" , authenticated , isAdmin ,  createVisaServices )

visaServicesRouter.put("/visa_services" , authenticated , isAdmin ,  updateVisaServices )

visaServicesRouter.delete("/visa_services/:id" , authenticated , isAdmin ,  deleteVisaServices )


export default visaServicesRouter;