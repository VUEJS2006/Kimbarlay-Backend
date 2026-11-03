import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { upload } from "../../middleware/upload.js";
import { createPrivateSeasonalHotDestinations, deletePrivateSeasonalHotDestinations, getAllPrivateSeasonalHotDestinations, updatePrivateSeasonalHotDestinations } from "../../controller/TravelController/privateSeasonalHotDestinationsController.js";

const privateSeasonalHotDestinationsRouter = express.Router();

privateSeasonalHotDestinationsRouter.get("/private_seasonal_hot_destinations/all" ,  getAllPrivateSeasonalHotDestinations )

privateSeasonalHotDestinationsRouter.post("/private_seasonal_hot_destinations" , upload.single("image") , authenticated , isAdmin , createPrivateSeasonalHotDestinations )

privateSeasonalHotDestinationsRouter.put("/private_seasonal_hot_destinations" , upload.single("image") , authenticated , isAdmin ,  updatePrivateSeasonalHotDestinations )

privateSeasonalHotDestinationsRouter.delete("/private_seasonal_hot_destinations/:id" , authenticated , isAdmin ,  deletePrivateSeasonalHotDestinations )

export default privateSeasonalHotDestinationsRouter;