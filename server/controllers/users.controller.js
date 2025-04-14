import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import UserModal from '../models/user.model.js';

const SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3d';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const existingUser = await UserModal.findOne({ email });
    
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist. Please check your email or sign up." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials. Please check your password." });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id }, 
      SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    if (!firstName || !lastName || !email || !password  ) {
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
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await UserModal.create({ 
      name: `${firstName} ${lastName}` ,
      email, 
      password: hashedPassword
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { email: result.email, id: result._id }, 
      SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.status(201).json({ result, token });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};
