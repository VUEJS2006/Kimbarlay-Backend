import express from "express";
import { changeBookingStatus, createBooking, deleteBooking, getBookings, updateBooking } from "../controller/bookingController.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";


const bookingRouter = express.Router();

bookingRouter.get('/bookings', getBookings);

bookingRouter.post('/bookings', createBooking);

bookingRouter.put('/bookings', updateBooking);

bookingRouter.patch('/bookings/status', changeBookingStatus);

bookingRouter.delete('/bookings/:id', deleteBooking);

export default bookingRouter;