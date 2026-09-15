import express from "express";
import { createRoute, deleteRoute, getRoutes, updateRoute } from "../controller/routeController.js";

const routeRouter = express.Router();

routeRouter.get("/routes" , getRoutes)

routeRouter.post("/admin/route/create" , createRoute);

routeRouter.put("/admin/route/update" , updateRoute);

routeRouter.delete('/admin/route/delete/:id' , deleteRoute)


export default routeRouter;
