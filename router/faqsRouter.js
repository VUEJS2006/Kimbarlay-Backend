import express from "express";
import { createFaqs, deleteFaq, getFaqs, updateFaqs } from "../controller/faqsController.js";
import { authencated, isAdmin } from "../middleware/authenticatedMiddleware.js";


const faqsRouter = express.Router();

faqsRouter.get("/faqs" , getFaqs);

faqsRouter.post("/faqs" , createFaqs);

faqsRouter.put("/faqs" , updateFaqs);

faqsRouter.delete("/faqs/:id" , deleteFaq);


export default faqsRouter;