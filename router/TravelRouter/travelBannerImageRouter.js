import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createTavelBannerImage, deleteTavelBannerImage, getAllTavelBannerImage, updateTavelBannerImage } from "../../controller/TravelController/travelBannerImageController.js";
import { upload } from "../../middleware/upload.js";
import { imageErrorHandlingMiddleware } from "../../middleware/imageErrorHandleMiddleware.js";

const travelBannerImageRouter = express.Router();

travelBannerImageRouter.get("/travel_banner_images/all" ,  getAllTavelBannerImage )

travelBannerImageRouter.post("/travel_banner_images" , upload.single("image"), imageErrorHandlingMiddleware , authenticated , isAdmin , createTavelBannerImage )

travelBannerImageRouter.put("/travel_banner_images" , upload.single("image"), imageErrorHandlingMiddleware , authenticated , isAdmin ,  updateTavelBannerImage )

travelBannerImageRouter.delete("/travel_banner_images/:id" , authenticated , isAdmin ,  deleteTavelBannerImage )


export default travelBannerImageRouter;