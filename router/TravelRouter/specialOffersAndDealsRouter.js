import express from "express"
import { createSpecialOfferAndDeal, deleteSpecialOfferAndDeal, getAllSpecialOffersAndDeals, updateSpecialOfferAndDeal } from "../../controller/TravelController/specialOffersAndDealsController.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const specialOffersAndDealsRouter = express.Router();

specialOffersAndDealsRouter.get("/special_offer_and_deal/all" ,  getAllSpecialOffersAndDeals )

specialOffersAndDealsRouter.post("/special_offer_and_deal" , authenticated , isAdmin ,  createSpecialOfferAndDeal )

specialOffersAndDealsRouter.put("/special_offer_and_deal" , authenticated , isAdmin ,  updateSpecialOfferAndDeal )

specialOffersAndDealsRouter.delete("/special_offer_and_deal/:id" , authenticated , isAdmin ,  deleteSpecialOfferAndDeal )


export default specialOffersAndDealsRouter;