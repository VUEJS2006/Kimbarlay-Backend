import express from "express";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { getAllPrivateSteps, updateAllPrivateSteps } from "../../controller/TravelController/privateStepsController.js";

const privateStepsRouter = express.Router();

privateStepsRouter.get("/travel_private_steps" , getAllPrivateSteps )

privateStepsRouter.put("/travel_private_steps/update/all" , authenticated , isAdmin , updateAllPrivateSteps )

export default privateStepsRouter;