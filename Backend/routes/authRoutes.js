import express from "express";
import { register, login, logout } from "../Controllers/authController.js"; // ✅ Import controllers

const router = express.Router();

// Define auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

export default router;
