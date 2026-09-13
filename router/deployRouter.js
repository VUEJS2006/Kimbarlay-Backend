import express from "express";
import { deployControllerFunction } from "../controller/deployController.js";

const githubWebhookRouter = express.Router();

// GitHub Webhook 
githubWebhookRouter.post("/", deployControllerFunction);

export default githubWebhookRouter;