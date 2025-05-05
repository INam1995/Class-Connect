import express from "express";
import { register, login, logout, sendotp, changePassword } from "../Controllers/authController.js";


import { resetPasswordToken, resetPassword } from "../Controllers/ResetPassword.js"; // Use `import` instead of `require`

const router = express.Router();

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);

// Route for user logout
router.get("/logout", logout);

// Route to send OTP for verification
router.post("/sendotp", sendotp);

// Route for password change
router.post("/changepassword", changePassword);

// Route to send reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route to reset the password
router.post("/reset-password", resetPassword);

export default router;
