import express from "express";
import { getNotifications } from "../Controllers/notification.js"; // Import controller

const router = express.Router();

// ✅ Use controller for GET request
router.get("/", getNotifications);

export default router;
