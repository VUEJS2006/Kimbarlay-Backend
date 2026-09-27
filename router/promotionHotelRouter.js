import express from "express"
import { deletePromotionHotels, getPromotionHotelsForAllTownships, getPromotionHotelsForEachTownship, promotionHotelCreate, updatePromotionHotels } from "../controller/promotionHotelController.js";
import { authencated, isAdmin } from "../middleware/authenticatedMiddleware.js";

const promotionHotelRouter = express.Router();

// get data for each township
promotionHotelRouter.get("/promotion/hotels/each/:township_id" , getPromotionHotelsForEachTownship )

// get all rows for all township
promotionHotelRouter.get("/promotion/hotels/all" , getPromotionHotelsForAllTownships )


// create promotionHotels
promotionHotelRouter.post("/admin/promotion/hotels/create" , authencated , isAdmin , promotionHotelCreate )

// change promotionHotels
promotionHotelRouter.put("/admin/promotion/hotels/update" , authencated , isAdmin , updatePromotionHotels )

// delete promotionHotels
promotionHotelRouter.delete("/admin/promotion/hotels/delete/:township_id" , authencated , isAdmin , deletePromotionHotels)

export default promotionHotelRouter;