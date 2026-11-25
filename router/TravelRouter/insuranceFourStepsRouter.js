import express from "express";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { getAllInsuranceFourSteps, updateAllInsuranceFourSteps } from "../../controller/TravelController/insuranceFourStepsController.js";

const insuranceFourStepsRouter = express.Router();

insuranceFourStepsRouter.get("/insurance_four_steps" , getAllInsuranceFourSteps )

insuranceFourStepsRouter.put("/insurance_four_steps/update/all" , authenticated , isAdmin , updateAllInsuranceFourSteps )

export default insuranceFourStepsRouter;