import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createTavelTestimonials, deleteTavelTestimonials, getAllTavelTestimonials, updateTavelTestimonials } from "../../controller/TravelController/travelTestimonialController.js";

const travelTestimonialRouter = express.Router();

travelTestimonialRouter.get("/travel_testimonials/all" ,  getAllTavelTestimonials )

travelTestimonialRouter.post("/travel_testimonials" , authenticated , isAdmin ,  createTavelTestimonials )

travelTestimonialRouter.put("/travel_testimonials" , authenticated , isAdmin ,  updateTavelTestimonials )

travelTestimonialRouter.delete("/travel_testimonials/:id" ,   deleteTavelTestimonials )


export default travelTestimonialRouter;