import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { upload } from "../../middleware/upload.js";
import { createLocalGroupTours, deleteLocalGroupTours, getAllLocalGroupTours, updateLocalGroupTours } from "../../controller/TravelController/localGroupToursController.js";
import { imageErrorHandlingMiddleware } from "../../middleware/imageErrorHandleMiddleware.js";

const localGroupToursRouter = express.Router();

localGroupToursRouter.get("/travel_local_group_tours/all" ,  getAllLocalGroupTours )

localGroupToursRouter.post("/travel_local_group_tours" , upload.single("image"), imageErrorHandlingMiddleware , authenticated , isAdmin , createLocalGroupTours )

localGroupToursRouter.put("/travel_local_group_tours" , upload.single("image"), imageErrorHandlingMiddleware , authenticated , isAdmin ,  updateLocalGroupTours )

localGroupToursRouter.delete("/travel_local_group_tours/:id" , authenticated , isAdmin ,  deleteLocalGroupTours )

export default localGroupToursRouter;