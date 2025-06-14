import dotenv from 'dotenv'; 
dotenv.config(); 

import mongoose from 'mongoose';
const dbURI = process.env.MONGO_URI; 

const connectDB = async () => {
  try {

    await mongoose.connect(dbURI, {
    });
    console.log(`Database connected successfully`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;