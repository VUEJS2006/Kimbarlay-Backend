import express from "express";
import { changeBookingStatus, createBooking, deleteBooking, getBookings, updateBooking } from "../controller/bookingController.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";


const bookingRouter = express.Router();

bookingRouter.get('/bookings', getBookings);

bookingRouter.post('/bookings', authenticated, createBooking);

bookingRouter.put('/bookings', authenticated, updateBooking);


bookingRouter.patch('/bookings/status', authenticated, isAdmin, changeBookingStatus);

bookingRouter.delete('/bookings/:id', authenticated, deleteBooking);

export default bookingRouter;