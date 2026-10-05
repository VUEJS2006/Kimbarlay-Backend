import { register, login, logout, userList } from "../controller/authController.js"
import express from "express";
import { authenticated, isAdmin, validateRegister } from "../middleware/authenticatedMiddleware.js";

const router = express.Router()

// Dashboard Site
router.post('/auth/register', validateRegister, register);
router.post('/auth/login', login);
router.post('/auth/user/list', authenticated, isAdmin, userList);
router.post('/auth/logout', logout);
export default router;