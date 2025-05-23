import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRouter from './routes/posts.route.js';
import userRouter from "./routes/users.route.js";
import profileRouter from "./routes/profile.route.js";

import { ERROR } from './utils/constants.js';
// Load environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({
  origin: "http://localhost:3000",
}));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/v1/posts', postRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/profile", profileRouter);

// Database connection
const CONNECTION_URL = process.env.MONGODB_URI;
const PORT = process.env.PORT;


// Global middleware for handling invalid routes, i.e., routes that are not defined
app.all('*', (req, res) => {
  res.status(404).json({ status: ERROR, message: 'Resource not found ==> invalid route' });
});
// Global error handler middleware
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({ status: error.statusText || ERROR, message: error.message, code: error.statusCode });
});

// Connect to MongoDB using Mongoose 8+ syntax
mongoose.connect(CONNECTION_URL)
  .then(() =>
    console.log('MongoDB Connected'))
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) =>
    console.log(`${error} did not connect`)
  );
