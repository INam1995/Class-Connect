import express from 'express';
const app = express()
import cors from 'cors';
import connectDB from './models/db.js';
import authRouter from './routes/auth.js'

import folderRouter from './routes/folderAuth.js'


app.use(express.json());

connectDB()

app.get('/',(req,res)=>{
    res.send("backend is working")
});

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true,
}));


app.use('/api/auth', authRouter);
app.use('/api/fAuth', folderRouter);




const port = process.env.PORT || 4000;
app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})

