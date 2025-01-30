import express from 'express';
import bcrypt from 'bcryptjs'; 
import User from '../models/user.js'; 

const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  const { name, username, email, password, course, college } = req.body;
  console.log("Request body:", req.body);
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      course,
      college,
    });
    console.log("New User:", newUser);
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;


