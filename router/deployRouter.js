import express from "express";
import { deployControllerFunction } from "../controller/deployController.js";

const githubWebhookRouter = express.Router();

// this route is not for frontend and just for auto deploy in name cheap 
// plsease, don't  change or delete anything
// GitHub Webhook 
githubWebhookRouter.post("/", deployControllerFunction);

export default githubWebhookRouter;