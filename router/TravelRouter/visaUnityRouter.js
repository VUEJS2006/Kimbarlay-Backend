import express from "express";
import { setIdForChoosingBanner } from "../../middleware/travelBannerMiddleware.js";
import { eidtVisaUnity, getVisaUnity } from "../../controller/TravelController/visaUnityController.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";


const visaUnityRouter = express.Router();

// for the intro
visaUnityRouter.get("/visa_intro", setIdForChoosingBanner({ id : "visa_intro" }) , getVisaUnity )

visaUnityRouter.put("/visa_intro", setIdForChoosingBanner({ id : "visa_intro" }) , authenticated, isAdmin , eidtVisaUnity )


// for the CTA
visaUnityRouter.get("/visa_cta", setIdForChoosingBanner({ id : "visa_cta" }) , getVisaUnity )

visaUnityRouter.put("/visa_cta", setIdForChoosingBanner({ id : "visa_cta" }) , authenticated, isAdmin , eidtVisaUnity )


// for the contact
visaUnityRouter.get("/visa_contact", setIdForChoosingBanner({ id : "visa_contact" }) , getVisaUnity )

visaUnityRouter.put("/visa_contact", setIdForChoosingBanner({ id : "visa_contact" }) , authenticated, isAdmin , eidtVisaUnity )



export default visaUnityRouter;