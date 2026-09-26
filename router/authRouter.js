import { register, login, logout } from "../controller/authController.js"
import exress from "express";
import { validateRegister } from "../middleware/authenticatedMiddleware.js";

const router = exress.Router()

// Dashboard Site
router.post('/auth/register', validateRegister, register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
export default router;