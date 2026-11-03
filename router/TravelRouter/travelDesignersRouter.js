import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { upload } from "../../middleware/upload.js";
import { createTravelDesigner, deleteTravelDesigner, getAllTravelDesigners, updateTravelDesigner } from "../../controller/TravelController/travelDesignersController.js";

const travelDesignersRouter = express.Router();

travelDesignersRouter.get("/travel_designers/all" ,  getAllTravelDesigners )

travelDesignersRouter.post("/travel_designers" , upload.single("image") , authenticated , isAdmin , createTravelDesigner )

travelDesignersRouter.put("/travel_designers" , upload.single("image") , authenticated , isAdmin ,  updateTravelDesigner )

travelDesignersRouter.delete("/travel_designers/:id" , authenticated , isAdmin ,  deleteTravelDesigner )

export default travelDesignersRouter;