import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { upload } from "../../middleware/upload.js";
import { imageErrorHandlingMiddleware } from "../../middleware/imageErrorHandleMiddleware.js";
import { createBoatTicket, deleteBoatTicket, getAllBoatTickets, updateBoatTicket } from "../../controller/busAndBoat/boatTicketsController.js";

const boatTicketsRouter = express.Router();

boatTicketsRouter.get("/boat_tickets/all" ,  getAllBoatTickets )

boatTicketsRouter.post("/boat_tickets" , upload.single("image"), imageErrorHandlingMiddleware , authenticated , isAdmin , createBoatTicket )

boatTicketsRouter.put("/boat_tickets" , upload.single("image"), imageErrorHandlingMiddleware , authenticated , isAdmin ,  updateBoatTicket )

boatTicketsRouter.delete("/boat_tickets/:id" , authenticated , isAdmin ,  deleteBoatTicket )


export default boatTicketsRouter;