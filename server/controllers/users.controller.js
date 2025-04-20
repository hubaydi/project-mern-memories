import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import UserModal from '../models/user.model.js';

import { SUCCESS, FAIL } from '../utils/constants.js';
import appError from '../utils/appError.js';

const SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3d';

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {

    const existingUser = await UserModal.findOne({ email });
    
    if (!existingUser) {
      const error = appError.create('User not found. Please sign up.', 404, FAIL);
      return next(error);
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    
    if (!isPasswordCorrect) {
      const error = appError.create('Invalid credentials. Please try again.', 401, FAIL);
      return next(error);
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id }, 
      SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.status(200).json({ status: SUCCESS, data: {result: existingUser, token } });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ status: FAIL, message: "Something went wrong. Please try again later." });
  }
};

export const signup = async (req, res, next) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      const error = appError.create('Passwords do not match. Please try again.', 400, FAIL);
      return next(error);
      }

    // Check if user already exists
    const existingUser = await UserModal.findOne({ email });
    
    if (existingUser) {
      const error = appError.create('User already exists. Please login.', 400, FAIL);
      return next(error);
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
    
    res.status(201).json({
      status: SUCCESS,
      data: { result, token },
      message: 'User registered successfully.'
    });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({status: FAIL, message: "Something went wrong. Please try again later." });
  }
};
