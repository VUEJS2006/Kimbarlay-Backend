import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { bookingComfirmOrCancelForSeasonalHotDestination, createSeasonalHotDestinationsBooking, deleteSeasonalHotDestinationsBooking, getAllSeasonalHotDestinationsBookings, getUserSeasonalHotDestinationsBookings } from "../../controller/TravelController/privateSeasonalHotDestinationsBookingController.js";

const privateSeasonalHotDestinationsBookingRouter = express.Router();

privateSeasonalHotDestinationsBookingRouter.get("/private_seasonal_hot_destinations_bookings/all" ,  authenticated , isAdmin ,  getAllSeasonalHotDestinationsBookings )

privateSeasonalHotDestinationsBookingRouter.get("/private_seasonal_hot_destinations_bookings/user" ,  authenticated ,  getUserSeasonalHotDestinationsBookings )

privateSeasonalHotDestinationsBookingRouter.post("/private_seasonal_hot_destinations_bookings" , authenticated , createSeasonalHotDestinationsBooking )

privateSeasonalHotDestinationsBookingRouter.patch("/private_seasonal_hot_destinations_bookings" , authenticated ,  bookingComfirmOrCancelForSeasonalHotDestination )

privateSeasonalHotDestinationsBookingRouter.delete("/private_seasonal_hot_destinations_bookings/:id" , authenticated , isAdmin ,  deleteSeasonalHotDestinationsBooking )


export default privateSeasonalHotDestinationsBookingRouter;