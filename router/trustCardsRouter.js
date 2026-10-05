import express from "express";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
import { getAllRefundCards, getAllTrustCards, updateAllRefundCards, updateAllTrustCards } from "../controller/trustCardsController.js";


const trustCardsRouter = express.Router();

// get all trust cards
trustCardsRouter.get("/trust_cards", getAllTrustCards)

// update all three cards
trustCardsRouter.put("/trust_cards/update/all", authenticated, isAdmin, updateAllTrustCards)



// for refund and rescheduling
trustCardsRouter.get("/refund_cards", getAllRefundCards)

trustCardsRouter.put("/refund_cards/update/all", authenticated, isAdmin, updateAllRefundCards)


export default trustCardsRouter;