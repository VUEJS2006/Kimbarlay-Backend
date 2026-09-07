import express from "express"
import { changeTranslation, getAllTranslations } from "../controller/translationsController.js";

const translationRouter = express.Router();

// get all data from translation table 
// call this route when the page is started or refreshed from layout
translationRouter.get('/admin/translations' , getAllTranslations)

// use this route for changing each or create if does not exit in database
translationRouter.post("/admin/translations/change" , changeTranslation )


export default translationRouter;