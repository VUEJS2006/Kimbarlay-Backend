import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { bookingComfirmOrCancelForAttraction, createLocalExploreAttractionsBooking, deleteLocalExploreAttractionsBooking, getAllLocalExploreAttractionsBookings, getUserLocalExploreAttractionsBookings } from "../../controller/TravelController/localExploreAttractionsBookingController.js";

const localExploreAttractionsBookingRouter = express.Router();

localExploreAttractionsBookingRouter.get("/local_explore_attractions_booking/all" ,  authenticated , isAdmin ,  getAllLocalExploreAttractionsBookings )

localExploreAttractionsBookingRouter.get("/local_explore_attractions_booking/user" ,  authenticated ,  getUserLocalExploreAttractionsBookings )

localExploreAttractionsBookingRouter.post("/local_explore_attractions_booking" , authenticated , createLocalExploreAttractionsBooking )

localExploreAttractionsBookingRouter.patch("/local_explore_attractions_booking" , authenticated ,  bookingComfirmOrCancelForAttraction )

localExploreAttractionsBookingRouter.delete("/local_explore_attractions_booking/:id" , authenticated , isAdmin ,  deleteLocalExploreAttractionsBooking )


export default localExploreAttractionsBookingRouter;