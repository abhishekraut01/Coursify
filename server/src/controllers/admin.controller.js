import { handleHashPassword } from '../utils/encyption.js';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js'; // Example path
import { SignUpSchema } from '../utils/validationSchema.js'

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


export const adminLogin = async (req, res) => {
  // Logic for logging in
};

export const adminLogout = async (req, res) => {
  // Logic for logging out
};

export const adminGetCourses = async (req, res) => {
  // Logic to get all courses
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
