import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRoutes from './routes/posts.js';
import userRouter from "./routes/user.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({
  origin: "*",
}));

// Routes
app.use('/posts', postRoutes);
app.use("/user", userRouter);

// Database connection
const CONNECTION_URL = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB using Mongoose 8+ syntax
mongoose.connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

// Note: useFindAndModify option has been removed in Mongoose 6+