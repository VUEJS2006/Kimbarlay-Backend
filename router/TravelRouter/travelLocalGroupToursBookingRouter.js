import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { bookingComfirmOrCancelForLocalGroupTour, createTravelLocalGroupToursBooking, deleteTravelLocalGroupToursBooking, getAllTravelLocalGroupToursBookings, getUserTravelLocalGroupToursBookings } from "../../controller/TravelController/travelLocalGroupToursBookingController.js";

const travelLocalGroupToursBookingRouter = express.Router();

travelLocalGroupToursBookingRouter.get("/travel_local_group_tours_bookings/all" ,  authenticated , isAdmin ,  getAllTravelLocalGroupToursBookings )

travelLocalGroupToursBookingRouter.get("/travel_local_group_tours_bookings/user" ,  authenticated ,  getUserTravelLocalGroupToursBookings )

travelLocalGroupToursBookingRouter.post("/travel_local_group_tours_bookings" , authenticated , createTravelLocalGroupToursBooking )

travelLocalGroupToursBookingRouter.patch("/travel_local_group_tours_bookings" , authenticated ,  bookingComfirmOrCancelForLocalGroupTour )

travelLocalGroupToursBookingRouter.delete("/travel_local_group_tours_bookings/:id" , authenticated , isAdmin ,  deleteTravelLocalGroupToursBooking )


export default travelLocalGroupToursBookingRouter;