import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { createTourismTourPackages, deleteTavelTourismTourPackages, getAllTourismTourPackages, updateTourismTourPackages } from "../../controller/TravelController/tourismTourPackageController.js";
import { upload } from "../../middleware/upload.js";

const tourismTourPackageRouter = express.Router();

tourismTourPackageRouter.get("/tourism_tour_packages/all" ,  getAllTourismTourPackages )

tourismTourPackageRouter.post("/tourism_tour_packages" , upload.single("image") , authenticated , isAdmin ,  createTourismTourPackages )

tourismTourPackageRouter.put("/tourism_tour_packages" , upload.single("image") , authenticated , isAdmin , updateTourismTourPackages )

tourismTourPackageRouter.delete("/tourism_tour_packages/:id" , authenticated , isAdmin ,  deleteTavelTourismTourPackages )


export default tourismTourPackageRouter;