import express from "express"
import { promotionHotelCreate } from "../controller/promotionHotelController.js";

const promotionHotelRouter = express.Router();


// create promotionHotels
promotionHotelRouter.post("/admin/promotion/hotels/create" , promotionHotelCreate )


export default promotionHotelRouter;