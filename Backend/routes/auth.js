import express from 'express';
import bcrypt from 'bcryptjs'; 
import User from '../models/user.js'; 

import jwt from 'jsonwebtoken'
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
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post("/login",async (req,res)=>{
  try{
      const user=await User.findOne({email:req.body.email})
      console.log(user)
      if(!user){
          return res.status(404).json("User not found!")
      }
      
      const match=await bcrypt.compare(req.body.password,user.password)
      
      if(!match){
          return res.status(401).json("Wrong credentials!")
      }
      
      const token=jwt.sign({_id:user._id,username:user.username,email:user.email},process.env.SECRET,{expiresIn:"3d"})
      const {password,...info}=user._doc
      res.cookie("token",token).status(200).json(info)
  

  }
  catch(err){
      res.status(500).json(err)
  }
})




router.get("/logout",async (req,res)=>{
  try{
      res.clearCookie("token",{sameSite:"none",secure:true}).status(200).send("User logged out successfully!")

  }
  catch(err){
      res.status(500).json(err)
  }
})
export default router;

