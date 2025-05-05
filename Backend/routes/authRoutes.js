import express from "express";
import { register, login, logout } from "../Controllers/authController/authController.js"; // ✅ Import controllers
import { AuthMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

// Define auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout",AuthMiddleware, logout);
export default router;