import express from "express";
import { setIdForChoosingBanner } from "../../middleware/bannerMiddleware.js";
import { getBusOrBoatContact, updateBusOrBoatContact } from "../../controller/busAndBoat/busAndBoatContactController.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const busAndBoatContactRouter = express.Router();

// for Bus Contact
busAndBoatContactRouter.get("/bus_contact", setIdForChoosingBanner({ id : "bus_contact" }) , getBusOrBoatContact )

busAndBoatContactRouter.put("/bus_contact", setIdForChoosingBanner({ id : "bus_contact" }) , authenticated , isAdmin , updateBusOrBoatContact )


// for Boat Contact
busAndBoatContactRouter.get("/boat_contact", setIdForChoosingBanner({ id : "boat_contact" }) , getBusOrBoatContact )

busAndBoatContactRouter.put("/boat_contact", setIdForChoosingBanner({ id : "boat_contact" }) , authenticated , isAdmin , updateBusOrBoatContact )


export default busAndBoatContactRouter;

