import express from "express";
import { setIdForChoosingBanner } from "../../middleware/bannerMiddleware.js";
import { getBusOrBoatUnity, updateBusOrBoatUnity } from "../../controller/busAndBoat/busAndBoatUnityController.js";
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const busAndBoatUnityRouter = express.Router();

// for Intro
busAndBoatUnityRouter.get("/bus_intro", setIdForChoosingBanner({ id : "bus_intro" }) , getBusOrBoatUnity )

busAndBoatUnityRouter.put("/bus_intro", setIdForChoosingBanner({ id : "bus_intro" }) , authenticated , isAdmin , updateBusOrBoatUnity )


// for Bus Line Heading 
busAndBoatUnityRouter.get("/bus_line_heading", setIdForChoosingBanner({ id : "bus_line_heading" }) , getBusOrBoatUnity )

busAndBoatUnityRouter.put("/bus_line_heading", setIdForChoosingBanner({ id : "bus_line_heading" }) , authenticated , isAdmin , updateBusOrBoatUnity )


// for Bus Route Heading
busAndBoatUnityRouter.get("/bus_route_heading", setIdForChoosingBanner({ id : "bus_route_heading" }) , getBusOrBoatUnity )

busAndBoatUnityRouter.put("/bus_route_heading", setIdForChoosingBanner({ id : "bus_route_heading" }) , authenticated , isAdmin , updateBusOrBoatUnity )


// for Bus Step Heading
busAndBoatUnityRouter.get("/bus_step_heading", setIdForChoosingBanner({ id : "bus_step_heading" }) , getBusOrBoatUnity )

busAndBoatUnityRouter.put("/bus_step_heading", setIdForChoosingBanner({ id : "bus_step_heading" }) , authenticated , isAdmin , updateBusOrBoatUnity )


// for Bus Why Heading
busAndBoatUnityRouter.get("/bus_why_heading", setIdForChoosingBanner({ id : "bus_why_heading" }) , getBusOrBoatUnity )

busAndBoatUnityRouter.put("/bus_why_heading", setIdForChoosingBanner({ id : "bus_why_heading" }) , authenticated , isAdmin , updateBusOrBoatUnity )


// for Bus Why Heading
busAndBoatUnityRouter.get("/boat_section_heading", setIdForChoosingBanner({ id : "boat_section_heading" }) , getBusOrBoatUnity )

busAndBoatUnityRouter.put("/boat_section_heading", setIdForChoosingBanner({ id : "boat_section_heading" }) , authenticated , isAdmin , updateBusOrBoatUnity )


export default busAndBoatUnityRouter;

