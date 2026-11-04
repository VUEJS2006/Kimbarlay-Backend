import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createInsuranceCoverageFeatures, deleteInsuranceCoverageFeatures, getAllInsuranceCoverageFeatures, updateInsuranceCoverageFeatures } from "../../controller/TravelController/insuranceCoverageFeaturesController.js";

const insuranceCoverageFeaturesRouter = express.Router();

insuranceCoverageFeaturesRouter.get("/insurance_coverage_features/all" ,  getAllInsuranceCoverageFeatures )

insuranceCoverageFeaturesRouter.post("/insurance_coverage_features" , authenticated , isAdmin ,  createInsuranceCoverageFeatures )

insuranceCoverageFeaturesRouter.put("/insurance_coverage_features" , authenticated , isAdmin ,  updateInsuranceCoverageFeatures )

insuranceCoverageFeaturesRouter.delete("/insurance_coverage_features/:id" , authenticated , isAdmin ,  deleteInsuranceCoverageFeatures )


export default insuranceCoverageFeaturesRouter;