import express from "express";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";
import { createRefundRequest, deleteRefundRequest, getRefundRequests, updateRefundRequest, updateRefundStatus } from "../controller/refundRequestController.js";


const refundRequestRouter = express.Router();

refundRequestRouter.get("/refunds", getRefundRequests)

refundRequestRouter.post("/refund/request" , authenticated, createRefundRequest)

refundRequestRouter.put("/refund/update/:id" , authenticated, updateRefundRequest )

refundRequestRouter.patch("/refund/change/status/:id" , authenticated, isAdmin, updateRefundStatus)

refundRequestRouter.delete("/refund/:id" , authenticated , deleteRefundRequest)

export default refundRequestRouter;