import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createInsuranceFAQs, deleteInsuranceFAQs, getAllInsuranceFAQs, updateInsuranceFAQs } from "../../controller/TravelController/insuranceFAQsController.js";

const insuranceFAQsRouter = express.Router();

insuranceFAQsRouter.get("/insurance_faqs/all" ,  getAllInsuranceFAQs )

insuranceFAQsRouter.post("/insurance_faqs" , authenticated , isAdmin ,  createInsuranceFAQs )

insuranceFAQsRouter.put("/insurance_faqs" , authenticated , isAdmin ,  updateInsuranceFAQs )

insuranceFAQsRouter.delete("/insurance_faqs/:id" , authenticated , isAdmin ,  deleteInsuranceFAQs )


export default insuranceFAQsRouter;