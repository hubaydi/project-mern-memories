import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import postRoutes from './routes/posts.route.js';
import userRouter from "./routes/users.route.js";

const app = express();

// Middleware setup
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({
  origin: "http://localhost:3000",
}));

// Routes
app.use('/api/v1/posts', postRoutes);
app.use("/api/v1/users", userRouter);

// Database connection
const CONNECTION_URL = process.env.MONGODB_URI;
const PORT = process.env.PORT;

// Connect to MongoDB using Mongoose 8+ syntax
mongoose.connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

// Note: useFindAndModify option has been removed in Mongoose 6+