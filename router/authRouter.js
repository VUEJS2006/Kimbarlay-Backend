import { register, login } from "../controller/authController.js"
import exress from "express";
import { validateRegister } from "../middleware/authenticatedMiddleware.js";

const router = exress.Router()

// Dashboard Site
router.post('/auth/register', validateRegister, register);
router.post('/auth/login', login);
export default router;