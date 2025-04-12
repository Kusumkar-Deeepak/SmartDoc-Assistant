import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import extractTextRoutes from "./routes/extractText.routes.js";
import connectDB from "./config/db.js";
import summarizeRoutes from "./routes/summarizeRoutes.js";
import qnaRoutes from "./routes/qna_routes.js"
import insightMirrorRouter from './routes/insightMirrorRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  })
);
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/api/summarize", summarizeRoutes);
app.use("/api/ai-qna", qnaRoutes);
app.use('/api/insight-mirror', insightMirrorRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
