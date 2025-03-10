import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserModal from "../models/user.model.js";

// Load environment variables
dotenv.config();

// Get JWT secret from environment variables or use default
const secret = process.env.JWT_SECRET || 'test';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const existingUser = await UserModal.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id }, 
      secret, 
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ message: "Something went wrong with authentication" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserModal.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = await UserModal.create({ 
      email, 
      password: hashedPassword, 
      name: `${firstName} ${lastName}` 
    });

    // Generate JWT token
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id }, 
      secret, 
      { expiresIn: "1h" }
    );

    res.status(201).json({ result: newUser, token });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({ message: "Something went wrong with registration" });
  }
};
