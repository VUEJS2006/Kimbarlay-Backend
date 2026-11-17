import express from "express";
import { bannerUpdate, getBanner, getOverseaHotelBanner, overSeaBannerUpdate } from "../controller/bannerController.js";
import { upload } from "../middleware/upload.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
import { imageErrorHandlingMiddleware } from "../middleware/imageErrorHandleMiddleware.js";

const bannerRouter = express.Router();

bannerRouter.get("/promo/banner", getBanner)


bannerRouter.put("/promo/banner", upload.single("image"), imageErrorHandlingMiddleware  , authenticated, isAdmin, bannerUpdate)

// oversea hotel banner
bannerRouter.get("/oversea/banner", getOverseaHotelBanner)

bannerRouter.put("/oversea/banner", upload.single("image"), imageErrorHandlingMiddleware  , overSeaBannerUpdate)



export default bannerRouter;