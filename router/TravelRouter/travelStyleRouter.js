import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { upload } from "../../middleware/upload.js";
import { createTavelStyle, deleteTavelStyle, getAllTavelStyle, updateTavelStyle } from "../../controller/TravelController/travelStyleController.js";
import { imageErrorHandlingMiddleware } from "../../middleware/imageErrorHandleMiddleware.js";

const travelStyleRouter = express.Router();

travelStyleRouter.get("/travel_style/all" ,  getAllTavelStyle )

travelStyleRouter.post("/travel_style" , upload.single("image"), imageErrorHandlingMiddleware , authenticated , isAdmin , createTavelStyle )

travelStyleRouter.put("/travel_style" , upload.single("image"), imageErrorHandlingMiddleware , authenticated , isAdmin ,  updateTavelStyle )

travelStyleRouter.delete("/travel_style/:id" , authenticated , isAdmin ,  deleteTavelStyle )


export default travelStyleRouter;