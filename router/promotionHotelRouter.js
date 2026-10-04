import express from "express"
import { deletePromotionHotels, getPromotionHotelsForAllTownships, getPromotionHotelsForEachTownship, promotionHotelCreate, updatePromotionHotels } from "../controller/promotionHotelController.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";

const promotionHotelRouter = express.Router();

// get data for each township
promotionHotelRouter.get("/promotion/hotels/each/:township_id", getPromotionHotelsForEachTownship)

// get all rows for all township
promotionHotelRouter.get("/promotion/hotels/all", getPromotionHotelsForAllTownships)


// create promotionHotels
promotionHotelRouter.post("/admin/promotion/hotels/create", authenticated, isAdmin, promotionHotelCreate)

// change promotionHotels
promotionHotelRouter.put("/admin/promotion/hotels/update", authenticated, isAdmin, updatePromotionHotels)

// delete promotionHotels
promotionHotelRouter.delete("/admin/promotion/hotels/delete/:township_id", authenticated, isAdmin, deletePromotionHotels)

export default promotionHotelRouter;