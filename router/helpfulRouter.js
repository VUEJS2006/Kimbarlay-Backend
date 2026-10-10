import { helpfulCreate } from "../controller/helpfulController.js"
import express from "express";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
const router = express.Router()

router.post('/mobile/helpful/create', authenticated, helpfulCreate)

export default router;