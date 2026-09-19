import express from "express";
import { bannerUpdate, getBanner } from "../controller/bannerController.js";
import { upload } from "../middleware/upload.js";

const bannerRouter = express.Router();

bannerRouter.get("/promo/banner" ,  getBanner)

bannerRouter.put("/promo/banner" , upload.single("image") , bannerUpdate)


export default bannerRouter;