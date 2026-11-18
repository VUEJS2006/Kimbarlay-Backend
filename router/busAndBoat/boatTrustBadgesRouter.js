import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createBoatTrustBadge, deleteBoatTrustBadge, getAllBoatTrustBadges, updateBoatTrustBadge } from "../../controller/busAndBoat/boatTrustBadgesController.js";

const boatTrustBadgesRouter = express.Router();

boatTrustBadgesRouter.get("/boat_trust_badges/all" ,  getAllBoatTrustBadges )

boatTrustBadgesRouter.post("/boat_trust_badges" , authenticated , isAdmin ,  createBoatTrustBadge )

boatTrustBadgesRouter.put("/boat_trust_badges" , authenticated , isAdmin ,  updateBoatTrustBadge )

boatTrustBadgesRouter.delete("/boat_trust_badges/:id" , authenticated , isAdmin ,  deleteBoatTrustBadge )


export default boatTrustBadgesRouter;