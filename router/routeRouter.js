import express from "express";
import { createRoute, deleteRoute, getRoutes, updateRoute } from "../controller/routeController.js";
import { authenticated, isAdmin } from "../middleware/authenticatedMiddleware.js";

const routeRouter = express.Router();

routeRouter.get("/routes", getRoutes)

// routeRouter.post("/admin/route/create" , authenticated , isAdmin , createRoute);

// routeRouter.put("/admin/route/update" , authenticated , isAdmin , updateRoute);

// routeRouter.delete('/admin/route/delete/:id' , authenticated , isAdmin , deleteRoute)


// temporarity
routeRouter.post("/admin/route/create", createRoute);

routeRouter.put("/admin/route/update", updateRoute);

routeRouter.delete('/admin/route/delete/:id', deleteRoute)


export default routeRouter;
