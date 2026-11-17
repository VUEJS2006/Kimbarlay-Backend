import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createTavelTestimonials, deleteTavelTestimonials, getAllTavelTestimonials, updateTavelTestimonials } from "../../controller/TravelController/travelTestimonialController.js";
import { upload } from "../../middleware/upload.js";
import { imageErrorHandlingMiddleware } from "../../middleware/imageErrorHandleMiddleware.js";

const travelTestimonialRouter = express.Router();

travelTestimonialRouter.get("/travel_testimonials/all" ,  getAllTavelTestimonials )

travelTestimonialRouter.post("/travel_testimonials" , upload.single("image"), imageErrorHandlingMiddleware , authenticated , isAdmin ,  createTavelTestimonials )

travelTestimonialRouter.put("/travel_testimonials" , upload.single("image"), imageErrorHandlingMiddleware ,   updateTavelTestimonials )

travelTestimonialRouter.delete("/travel_testimonials/:id" , authenticated , isAdmin ,  deleteTavelTestimonials )


export default travelTestimonialRouter;