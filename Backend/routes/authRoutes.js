import express from "express";
import { register, login, logout,sendotp } from "../Controllers/authController/authController.js"; // ✅ Import controllers
import { AuthMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

// Define auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout",AuthMiddleware, logout);
router.post("/sendotp",sendotp);



export default router;
