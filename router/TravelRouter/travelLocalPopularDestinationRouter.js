import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { upload } from "../../middleware/upload.js";
import { createLocalPopularDestination, deleteLocalPopularDestination, getAllLocalPopularDestination, updateLocalPopularDestination } from "../../controller/TravelController/travelLocalPopularDestinationController.js";
import { imageErrorHandlingMiddleware } from "../../middleware/imageErrorHandleMiddleware.js";

const travelLocalPopularDestinationRouter = express.Router();

travelLocalPopularDestinationRouter.get("/local_popular_destination/all" ,  getAllLocalPopularDestination )

travelLocalPopularDestinationRouter.post("/local_popular_destination" , upload.single("image"), imageErrorHandlingMiddleware , authenticated , isAdmin , createLocalPopularDestination )

travelLocalPopularDestinationRouter.put("/local_popular_destination" , upload.single("image"), imageErrorHandlingMiddleware , authenticated , isAdmin ,  updateLocalPopularDestination )

travelLocalPopularDestinationRouter.delete("/local_popular_destination/:id" , authenticated , isAdmin ,  deleteLocalPopularDestination )

export default travelLocalPopularDestinationRouter;