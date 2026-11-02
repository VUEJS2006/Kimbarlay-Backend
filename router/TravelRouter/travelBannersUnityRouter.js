import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { upload } from "../../middleware/upload.js";
import { updateTravelBannersUnity } from "../../controller/TravelController/travelBannersUnityController.js";
import { setIdForChoosingBanner } from "../../middleware/travelBannerMiddleware.js"

const travelBannersUnityRouter = express.Router();

// travelBannersUnityRouter.get("/travel_banners_unity/all" ,  getAllTavelBannerImage )

travelBannersUnityRouter.put("/local_tours_bunner" , upload.single("image") , authenticated , isAdmin , setIdForChoosingBanner({ id : "local_tours_bunner" }) , updateTravelBannersUnity )

// travelBannersUnityRouter.delete("/travel_banners_unity/:id" , authenticated , isAdmin ,  deleteTavelBannerImage )


export default travelBannersUnityRouter;