import jwt from "jsonwebtoken";
import User from "../models/user.js";
const jwtSecret = process.env.SECRET;


const authMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required" });
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, jwtSecret, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        const userId = payload._id; 
        User.findById(userId).then(userData => {
            if (!userData) {
                return res.status(404).json({ error: "User not found" });
            }
            req.user = userData;  // Attach the user to the request object
            next();  // Continue to the next middleware or route handler
        }).catch(err => {
            res.status(500).json({ error: "Internal server error" });
        });
    });
};

export default authMiddleware;
