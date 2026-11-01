import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { bookingComfirmOrCancel, createTourismTourBooking, deleteTourismTourBooking, getAllTourismTourBookings, getUserTourismTourBookings } from "../../controller/TravelController/tourismTourBookingController.js";

const tourismTourBookingRouter = express.Router();

tourismTourBookingRouter.get("/tourism_tour_booking/all" ,  authenticated , isAdmin ,  getAllTourismTourBookings )

tourismTourBookingRouter.get("/tourism_tour_booking/user" ,  authenticated ,  getUserTourismTourBookings )

tourismTourBookingRouter.post("/tourism_tour_booking" , authenticated , createTourismTourBooking )

tourismTourBookingRouter.patch("/tourism_tour_booking" , authenticated ,  bookingComfirmOrCancel )

tourismTourBookingRouter.delete("/tourism_tour_booking/:id" , authenticated , isAdmin ,  deleteTourismTourBooking )


export default tourismTourBookingRouter;