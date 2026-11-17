import express from "express";
import { upload } from "../../middleware/upload.js";
import { getBusOrBoatBanner, updateBusAndBoatBanner } from "../../controller/busAndBoat/busAndBoatBannerController.js";
import { setIdForChoosingBanner } from "../../middleware/bannerMiddleware.js";
import { imageErrorHandlingMiddleware } from "../../middleware/imageErrorHandleMiddleware.js"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const busAndBoatBannerRouter = express.Router();

const imageFields = [ { name : "background_image" , maxCount : 1 } , { name : "phone_screen_image" , maxCount : 1 } , { name : "qr_code_image" , maxCount : 1 } ]

// for bus banner
busAndBoatBannerRouter.get("/bus_banner", setIdForChoosingBanner({ id : "bus_banner" }), getBusOrBoatBanner )

busAndBoatBannerRouter.put("/bus_banner" , upload.fields(imageFields) , authenticated , isAdmin , imageErrorHandlingMiddleware , setIdForChoosingBanner({ id : "bus_banner" }) , updateBusAndBoatBanner )

// for boat banner
busAndBoatBannerRouter.get("/boat_banner", setIdForChoosingBanner({ id : "boat_banner" }), getBusOrBoatBanner )

busAndBoatBannerRouter.put("/boat_banner" , upload.fields(imageFields) , authenticated , isAdmin , imageErrorHandlingMiddleware , setIdForChoosingBanner({ id : "boat_banner" }) , updateBusAndBoatBanner )

export default busAndBoatBannerRouter;


