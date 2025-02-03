import jwt from 'jsonwebtoken';

const VerifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {

    const decoded = jwt.verify(token, process.env.SECRET); // Verify token
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to the next middleware or route
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default VerifyToken;
