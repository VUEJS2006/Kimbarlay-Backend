import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createTavelGroupOnBanners, deleteTavelGroupOnBanners, getAllTavelGroupOnBanners, updateTavelGroupOnBanners } from "../../controller/TravelController/travelGroupOnBannerController.js";

const travelGroupOnBannerRouter = express.Router();

travelGroupOnBannerRouter.get("/travel_group_on_banners/all" ,  getAllTavelGroupOnBanners )

travelGroupOnBannerRouter.post("/travel_group_on_banners" , authenticated , isAdmin ,  createTavelGroupOnBanners )

travelGroupOnBannerRouter.put("/travel_group_on_banners" , authenticated , isAdmin ,  updateTavelGroupOnBanners )

travelGroupOnBannerRouter.delete("/travel_group_on_banners/:id" , authenticated , isAdmin ,  deleteTavelGroupOnBanners )


export default travelGroupOnBannerRouter;