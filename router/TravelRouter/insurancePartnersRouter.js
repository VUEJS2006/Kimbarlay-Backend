import express from "express"
import { authenticated, isAdmin } from "../../middleware/authenticatedMiddleware.js";
import { upload } from "../../middleware/upload.js";
import { createInsurancePartners, deleteInsurancePartners, getAllInsurancePartners, updateInsurancePartners } from "../../controller/TravelController/insurancePartnersController.js";

const insurancePartnersRouter = express.Router();

insurancePartnersRouter.get("/insurance_partners/all" ,  getAllInsurancePartners )

insurancePartnersRouter.post("/insurance_partners" , upload.single("image") , authenticated , isAdmin , createInsurancePartners )

insurancePartnersRouter.put("/insurance_partners" , upload.single("image") , authenticated , isAdmin ,  updateInsurancePartners )

insurancePartnersRouter.delete("/insurance_partners/:id" , authenticated , isAdmin ,  deleteInsurancePartners )


export default insurancePartnersRouter;