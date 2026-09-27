import express from "express";
import { createRoute, deleteRoute, getRoutes, updateRoute } from "../controller/routeController.js";
import { authencated, isAdmin } from "../middleware/authenticatedMiddleware.js";

const routeRouter = express.Router();

routeRouter.get("/routes" , getRoutes)

routeRouter.post("/admin/route/create" , authencated , isAdmin , createRoute);

routeRouter.put("/admin/route/update" , authencated , isAdmin , updateRoute);

routeRouter.delete('/admin/route/delete/:id' , authencated , isAdmin , deleteRoute)


export default routeRouter;
