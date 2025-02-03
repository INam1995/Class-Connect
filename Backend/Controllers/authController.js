import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    const { name, username, email, password, course, college } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            course,
            college,
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const loginUser = async (req, res) => {
  try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
          return res.status(404).json({ message: "User not found!" });
      }
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
          return res.status(401).json({ message: "Wrong credentials!" });
      }
      const token = jwt.sign(
          { _id: user._id, username: user.username, email: user.email },
          process.env.SECRET,
          { expiresIn: "3d" }
      );
      const { password, ...info } = user._doc;
      // Send token in response body
      return res.status(200).json({ ...info, token });
      // If you prefer to send it in a cookie:
      // res.cookie("token", token, { httpOnly: true }).status(200).json(info);

  } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
};
