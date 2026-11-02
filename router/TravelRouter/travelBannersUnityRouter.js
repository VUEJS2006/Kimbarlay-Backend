import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { upload } from "../../middleware/upload.js";
import { getTravelBannersUnity, updateTravelBannersUnity } from "../../controller/TravelController/travelBannersUnityController.js";
import { setIdForChoosingBanner } from "../../middleware/travelBannerMiddleware.js"

const travelBannersUnityRouter = express.Router();

// for local tours banner
travelBannersUnityRouter.get("/local_tours_bunner" , setIdForChoosingBanner({ id : "local_tours_bunner" }) , getTravelBannersUnity )

travelBannersUnityRouter.put("/local_tours_bunner" , upload.single("image") , authenticated , isAdmin , setIdForChoosingBanner({ id : "local_tours_bunner" }) , updateTravelBannersUnity )

// for local tours banner
travelBannersUnityRouter.get("/private_customize_travel_banner" , setIdForChoosingBanner({ id : "private_customize_travel_banner" }) , getTravelBannersUnity )

travelBannersUnityRouter.put("/private_customize_travel_banner" , upload.single("image") , authenticated , isAdmin , setIdForChoosingBanner({ id : "private_customize_travel_banner" }) , updateTravelBannersUnity )


// for local tours banner
travelBannersUnityRouter.get("/insurance_banner" , setIdForChoosingBanner({ id : "insurance_banner" }) , getTravelBannersUnity )

travelBannersUnityRouter.put("/insurance_banner" , upload.single("image") , authenticated , isAdmin , setIdForChoosingBanner({ id : "insurance_banner" }) , updateTravelBannersUnity )


export default travelBannersUnityRouter;