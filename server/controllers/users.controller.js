import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import UserModal from '../models/user.model.js';

// Load environment variables
dotenv.config();

// Get JWT secret from environment variables or use default
const secret = process.env.JWT_SECRET;

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user by email
    const existingUser = await UserModal.findOne({ email });
    
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist. Please check your email or sign up." });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials. Please check your password." });
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
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    // Input validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required." });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match." });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    // Check if user already exists
    const existingUser = await UserModal.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please sign in instead." });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await UserModal.create({ 
      email, 
      password: hashedPassword, 
      name: `${firstName} ${lastName}` 
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { email: result.email, id: result._id }, 
      secret, 
      { expiresIn: "7d" }
    );
    
    res.status(201).json({ result, token });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};
