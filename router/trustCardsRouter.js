import express from "express";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
import { getAllHotelCards, getAllRefundCards, getAllTravelSecurityCards, getAllTrustCards, updateAllHotelsCards, updateAllRefundCards, updateAllTravelSecurityCards, updateAllTrustCards } from "../controller/trustCardsController.js";


const trustCardsRouter = express.Router();

// get all trust cards
trustCardsRouter.get("/trust_cards", getAllTrustCards)

// update all three cards
trustCardsRouter.put("/trust_cards/update/all", authenticated, isAdmin, updateAllTrustCards)



// for refund and rescheduling
trustCardsRouter.get("/refund_cards", getAllRefundCards)

trustCardsRouter.put("/refund_cards/update/all", authenticated, isAdmin, updateAllRefundCards)


// for domestic hotels
trustCardsRouter.get("/hotel_cards", getAllHotelCards)

trustCardsRouter.put("/hotel_cards/update/all", authenticated, isAdmin, updateAllHotelsCards)


// for travel security
trustCardsRouter.get("/travel_security_cards", getAllTravelSecurityCards)

trustCardsRouter.put("/travel_security_cards/update/all", authenticated, isAdmin, updateAllTravelSecurityCards)

// for action


export default trustCardsRouter;