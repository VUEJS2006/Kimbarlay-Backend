import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { upload } from "../../middleware/upload.js";
import { createLocalExploreAttractions, deleteLocalExploreAttractions, getAllLocalExploreAttractions, updateLocalExploreAttractions } from "../../controller/TravelController/localTourExporeAttractionController.js";
import { imageErrorHandlingMiddleware } from "../../middleware/imageErrorHandleMiddleware.js";

const localTourExploreAttractionRouter = express.Router();

localTourExploreAttractionRouter.get("/local_explore_attractions/all" ,  getAllLocalExploreAttractions )

localTourExploreAttractionRouter.post("/local_explore_attractions" , upload.single("image"), imageErrorHandlingMiddleware , authenticated , isAdmin , createLocalExploreAttractions )

localTourExploreAttractionRouter.put("/local_explore_attractions" , upload.single("image"), imageErrorHandlingMiddleware , authenticated , isAdmin ,  updateLocalExploreAttractions )

localTourExploreAttractionRouter.delete("/local_explore_attractions/:id" , authenticated , isAdmin ,  deleteLocalExploreAttractions )

export default localTourExploreAttractionRouter;