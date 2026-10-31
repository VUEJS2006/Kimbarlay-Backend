import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";

const tourismTourPackageRouter = express.Router();

// tourismTourPackageRouter.get("/travel_testimonials/all" ,  getAllTavelTestimonials )

// tourismTourPackageRouter.post("/tourism_tour_packages" ,  createTavelTestimonials )

// tourismTourPackageRouter.put("/travel_testimonials" , authenticated , isAdmin ,  updateTavelTestimonials )

// tourismTourPackageRouter.delete("/travel_testimonials/:id" ,   deleteTavelTestimonials )


export default tourismTourPackageRouter;