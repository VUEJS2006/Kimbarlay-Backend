import express from "express";
import { createFaqs, deleteFaq, getFaqs, updateFaqs } from "../controller/faqsController.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";


const faqsRouter = express.Router();

faqsRouter.get("/faqs", getFaqs);

faqsRouter.post("/faqs" , authenticated, isAdmin, createFaqs);

faqsRouter.put("/faqs" , authenticated, isAdmin , updateFaqs);

faqsRouter.delete("/faqs/:id" , authenticated, isAdmin , deleteFaq);


export default faqsRouter;