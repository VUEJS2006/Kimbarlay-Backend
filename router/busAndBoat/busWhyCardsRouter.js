import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createBusWhyCard, deleteBusWhyCard, getAllBusWhyCards, updateBusWhyCard } from "../../controller/busAndBoat/busWhyCardsController.js";

const busWhyCardsRouter = express.Router();

busWhyCardsRouter.get("/bus_why_cards/all" ,  getAllBusWhyCards )

busWhyCardsRouter.post("/bus_why_cards" , authenticated , isAdmin ,  createBusWhyCard )

busWhyCardsRouter.put("/bus_why_cards" , authenticated , isAdmin ,  updateBusWhyCard )

busWhyCardsRouter.delete("/bus_why_cards/:id" , authenticated , isAdmin ,  deleteBusWhyCard )


export default busWhyCardsRouter;