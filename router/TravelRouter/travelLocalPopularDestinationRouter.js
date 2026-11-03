import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { upload } from "../../middleware/upload.js";
import { createLocalPopularDestination, deleteLocalPopularDestination, getAllLocalPopularDestination, updateLocalPopularDestination } from "../../controller/TravelController/travelLocalPopularDestinationController.js";

const travelLocalPopularDestinationRouter = express.Router();

travelLocalPopularDestinationRouter.get("/local_popular_destination/all" ,  getAllLocalPopularDestination )

travelLocalPopularDestinationRouter.post("/local_popular_destination" , upload.single("image") , authenticated , isAdmin , createLocalPopularDestination )

travelLocalPopularDestinationRouter.put("/local_popular_destination" , upload.single("image") , authenticated , isAdmin ,  updateLocalPopularDestination )

travelLocalPopularDestinationRouter.delete("/local_popular_destination/:id" , authenticated , isAdmin ,  deleteLocalPopularDestination )

export default travelLocalPopularDestinationRouter;