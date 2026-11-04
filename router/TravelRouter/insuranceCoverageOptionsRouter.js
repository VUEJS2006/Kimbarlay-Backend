import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createInsuranceCoverageOptions, deleteInsuranceCoverageOptions, getAllInsuranceCoverageOptions, updateInsuranceCoverageOptions } from "../../controller/TravelController/insuranceCoverageOptionsController.js";

const insuranceCoverageOptionsRouter = express.Router();

insuranceCoverageOptionsRouter.get("/insurance_coverage_options/all" ,  getAllInsuranceCoverageOptions )

insuranceCoverageOptionsRouter.post("/insurance_coverage_options" , authenticated , isAdmin ,  createInsuranceCoverageOptions )

insuranceCoverageOptionsRouter.put("/insurance_coverage_options" , authenticated , isAdmin ,  updateInsuranceCoverageOptions )

insuranceCoverageOptionsRouter.delete("/insurance_coverage_options/:id" , authenticated , isAdmin ,  deleteInsuranceCoverageOptions )


export default insuranceCoverageOptionsRouter;