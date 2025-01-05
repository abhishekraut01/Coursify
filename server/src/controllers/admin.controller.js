import { handleHashPassword } from '../utils/encyption.js';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js'; // Example path
import Courses from '../models/courses.model.js';
import { courseSchema, loginSchema, SignUpSchema } from '../utils/validationSchema.js';
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
  try {
    const allCourses = await Courses.find({});

    if (allCourses.length === 0) {
      return res.status(404).json({
        message: 'No courses found',
      });
    }

    res.status(200).json({
      message: 'All courses fetched successfully',
      courses: allCourses,
    });
  } catch (error) {
    next(error);
  }
};

export const adminAddCourses = async (req, res, next) => {
  // Validate input using courseSchema
  const validationResult = courseSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: 'Invalid input',
      errors: validationResult.error.errors,
    });
  }

  const { title, description, price, imageLink, published } = req.body;

  try {
    // Ensure that the admin is set in the request (from the authentication middleware)
    const adminId = req.admin?._id;

    if (!adminId) {
      return res.status(403).json({
        message: 'Admin authentication required',
      });
    }

    // Create the course
    const newCourse = new Courses({
      title,
      description,
      price,
      imageLink,
      createdBy: adminId, // Associate the course with the admin
      published: published || false, // Default to false if not provided
    });

    // Save the new course
    const savedCourse = await newCourse.save();

    // Send success response with course ID
    res.status(201).json({
      message: 'Course created successfully',
      courseId: savedCourse._id,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    next(error); // Pass the error to error-handling middleware
  }
};


export const adminUpdateCourse = async (req, res) => {
  // Logic for updating a course
};

export const adminDeleteCourse = async (req, res) => {
  // Logic for deleting a course
};
