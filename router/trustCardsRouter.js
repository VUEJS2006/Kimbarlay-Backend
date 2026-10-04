import express from "express";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
import { getAllTrustCards, updateAllTrustCards } from "../controller/trustCardsController.js";


const trustCardsRouter = express.Router();

// get all trust cards
trustCardsRouter.get("/trust_cards", getAllTrustCards)

// update all three cards
trustCardsRouter.put("/trust_cards/update/all", authenticated, isAdmin, updateAllTrustCards)


export default trustCardsRouter;