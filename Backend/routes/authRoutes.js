import express from "express";
import { register, login, logout,sendotp } from "../Controllers/authController/authController.js"; // ✅ Import controllers
import { AuthMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);
router.post("/logout",AuthMiddleware, logout);
router.post("/sendotp",sendotp);



export default router;
