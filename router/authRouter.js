import { register, login, logout, userList, verifyOTP } from "../controller/authController.js"
import express from "express";
import { authenticated, isAdmin, validateRegister } from "../middleware/authenticatedMiddleware.js";

const router = express.Router()

// Dashboard Site
router.post('/auth/register', validateRegister, register);
router.post('/auth/verify/otp', validateRegister, verifyOTP);
router.post('/auth/login', login);
router.get('/auth/user/list', authenticated, isAdmin, userList);
router.post('/auth/logout', logout);
export default router;