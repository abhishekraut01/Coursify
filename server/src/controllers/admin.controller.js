import { handleHashPassword } from '../utils/encyption.js';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js'; // Example path
import { loginSchema, SignUpSchema } from '../utils/validationSchema.js';
import bcrypt from 'bcryptjs';

export const adminSignUp = async (req, res, next) => {
  const validationResponse = SignUpSchema.safeParse(req.body);

  if (!validationResponse.success) {
    return res.status(400).json({
      success: false,
      message: 'Input is invalid, please try again.',
    });
  }

  const { username, password, email } = req.body;

  try {
    // Check if user already exists
    const isUserAlreadyExist = await Admin.findOne({ username });
    if (isUserAlreadyExist) {
      return res.status(409).json({
        success: false,
        message: 'User already exists.',
      });
    }

    const hashPass = await handleHashPassword(password);

    // Create a new admin
    const newAdmin = new Admin({
      username,
      email,
      password: hashPass,
    });

    await newAdmin.save();

    // Create and send JWT
    const token = jwt.sign({ userId: newAdmin._id }, process.env.JWT_KEY, {
      expiresIn: '1d',
    });

    res
      .status(201)
      .cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        success: true,
        message: 'Admin created successfully.',
      });
  } catch (error) {
    console.error('Error in adminSignUp controller:', error);
    next(error);
  }
};

// adminLoginWorkflow -> user will send the username and password and we will find is admin is availabe in database or not if yes then we will compare hashed password with plain password and all things are good then we will send the jwt token to user

export const adminLogin = async (req, res, next) => {
  const validationResponse = loginSchema.safeParse(req.body);

  if (!validationResponse.success) {
    return res.status(400).json({
      success: false,
      message: 'Input is invalid, please try again.',
      errors: validationResponse.error.errors,
    });
  }

  const { username, password } = req.body;

  try {
    // Check if user exists
    const isUserExist = await Admin.findOne({ username });
    if (!isUserExist) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    // Validate password
    const validatePassword = await bcrypt.compare(
      password,
      isUserExist.password
    );
    if (!validatePassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    // Create and send JWT
    const token = jwt.sign({ adminId: isUserExist._id }, process.env.JWT_KEY, {
      expiresIn: '1d', // Token valid for 1 day
    });

    res
      .status(200)
      .cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        success: true,
        message: 'Admin logged in successfully.',
      });
  } catch (error) {
    console.error('Error in Login controller:', error);
    next(error);
  }
};

export const adminLogout = async (req, res) => {
  // Clear the JWT cookie by setting it to expire immediately
  res.cookie('jwt', '', {
    httpOnly: true, // Ensures cookie is not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict', // Ensures cookies are sent in same-site requests
    expires: new Date(0), // Sets the cookie expiration to the past
  });

  // Send response
  res.status(200).json({
    message: 'Logged out successfully',
  });
};

export const adminGetCourses = async (req, res) => {
  
};

export const adminAddCourses = async (req, res) => {
  // Logic for adding a new course
};

export const adminUpdateCourse = async (req, res) => {
  // Logic for updating a course
};

export const adminDeleteCourse = async (req, res) => {
  // Logic for deleting a course
};
