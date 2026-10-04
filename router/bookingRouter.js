import express from "express";
import { changeBookingStatus, createBooking, deleteBooking, getBookings, updateBooking } from "../controller/bookingController.js";
import { authencated, isAdmin } from "../middleware/authenticatedMiddleware.js";


const bookingRouter = express.Router();

bookingRouter.get('/bookings', getBookings);

bookingRouter.post('/bookings' , authencated , createBooking );

bookingRouter.put('/bookings' , authencated , updateBooking );

bookingRouter.patch('/bookings/status', authencated , isAdmin , changeBookingStatus);

bookingRouter.delete('/bookings/:id' , authencated , deleteBooking);

export default bookingRouter;