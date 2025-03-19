import express from 'express';
import cors from 'cors';
import connectDB from './models/db.js';
import authRouter from './routes/authRoutes.js';
import folderRouter from './routes/folderRoutes.js';
import downloadPdf from './routes/downloadRoutes.js';
import pdfRoute from './routes/pdfRoutes.js';
import questionRouter from './routes/questionRoutes.js';
import answerRouter from './routes/answerRoutes.js';
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());

// Connect to Database
connectDB();

app.get('/', (req, res) => {
    res.send("Backend is working");
});

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true,
}));

// // Body parser
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// // Serve static files
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// app.use(express.static(path.join(__dirname, "../frontend/dist")));

// app.get("*", (req, res) => {
//     console.log(__dirname);
//     try {
//         res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//     } catch (error) {
//         res.send("Oops! An unexpected error occurred.");
//     }
// });

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/folders', folderRouter);
app.use('/api/pdfs', pdfRoute);
app.use('/api/answers', answerRouter);  // ✅ Fixed missing `/`
app.use('/api/questions', questionRouter);  // ✅ Fixed missing `/`
app.use('/api/download', downloadPdf);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
