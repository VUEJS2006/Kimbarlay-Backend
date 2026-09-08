import express from "express"
import { deletePromotionHotels, getPromotionHotelsForAllTownships, getPromotionHotelsForEachTownship, promotionHotelCreate, updatePromotionHotels } from "../controller/promotionHotelController.js";

const promotionHotelRouter = express.Router();

// get data for each township
promotionHotelRouter.get("/promotion/hotels/each/:township_id" , getPromotionHotelsForEachTownship )

// get all rows for all township
promotionHotelRouter.get("/promotion/hotels/all" , getPromotionHotelsForAllTownships )


// create promotionHotels
promotionHotelRouter.post("/admin/promotion/hotels/create" , promotionHotelCreate )

// change promotionHotels
promotionHotelRouter.put("/admin/promotion/hotels/update" , updatePromotionHotels )

// delete promotionHotels
promotionHotelRouter.delete("/admin/promotion/hotels/delete/:township_id" , deletePromotionHotels)

export default promotionHotelRouter;