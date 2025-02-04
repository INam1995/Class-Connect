import express from 'express';
const app = express()
import cors from 'cors';
import connectDB from './models/db.js';
import authRouter from './routes/authRoutes.js'
import folderRouter from './routes/folderRoutes.js'
import downloadPdf from './routes/downloadRoutes.js';
import pdfRoute from './routes/pdfRoutes.js'

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

app.use('/api/folders', folderRouter);  // ✅ Change for folders
app.use('/api/pdfs', pdfRoute);  // ✅ Change for PDFs


app.use('/api/download',downloadPdf);

const port = process.env.PORT || 4000;
app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})