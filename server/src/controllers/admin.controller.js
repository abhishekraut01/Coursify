import { handleHashPassword } from '../utils/encyption.js';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import Courses from '../models/courses.model.js';
import {
  courseSchema,
  loginSchema,
  SignUpSchema,
  updateCourseSchema,
} from '../utils/validationSchema.js';
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
    const isUserAlreadyExist = await Admin.findOne({ username });
    if (isUserAlreadyExist) {
      return res.status(409).json({
        success: false,
        message: 'User already exists.',
      });
    }

    const hashPass = await handleHashPassword(password);

    const newAdmin = new Admin({
      username,
      email,
      password: hashPass,
    });

    await newAdmin.save();

    const token = jwt.sign({ adminId: newAdmin._id }, process.env.JWT_KEY, {
      expiresIn: '1d',
    });

    res
      .status(201)
      .cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
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
    const isUserExist = await Admin.findOne({ username });
    if (!isUserExist) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

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

    const token = jwt.sign({ adminId: isUserExist._id }, process.env.JWT_KEY, {
      expiresIn: '1d',
    });

    res
      .status(200)
      .cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
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
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  });

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

export const adminUpdateCourse = async (req, res, next) => {
  const validationResult = updateCourseSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: 'Invalid input',
      errors: validationResult.error.errors,
    });
  }

  const { title, description, price, imageLink, published } = req.body;
  const { courseId } = req.params; // Extract courseId from route parameters

  try {
    const adminId = req.admin?.adminId; // Get the admin ID from authenticated user

    if (!adminId) {
      return res.status(403).json({
        message: 'Admin authentication required',
      });
    }

    // Find the course by ID
    const course = await Courses.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    // Ensure the admin updating the course is the one who created it
    if (course.createdBy.toString() !== adminId.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to update this course',
      });
    }

    // Update the course fields
    const updates = {
      title: title || course.title,
      description: description || course.description,
      price: price ?? course.price, // Allow price to be 0
      imageLink: imageLink || course.imageLink,
      published: published ?? course.published,
    };

    // Save the updated course
    const updatedCourse = await Courses.findByIdAndUpdate(courseId, updates, {
      new: true,
    });

    res.status(200).json({
      message: 'Course updated successfully',
      updatedCourse,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    next(error); // Forward the error to the error-handling middleware
  }
};

export const adminDeleteCourse = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    // Extract adminId from the authenticated user
    const adminId = req.admin?.adminId;

    if (!adminId) {
      return res.status(403).json({
        message: 'Admin authentication required',
      });
    }

    // Find the course by ID
    const course = await Courses.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    // Ensure the admin deleting the course is the one who created it
    if (course.createdBy.toString() !== adminId.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to delete this course',
      });
    }

    // Delete the course
    const deletedCourse = await Courses.findByIdAndDelete(courseId);

    res.status(200).json({
      message: 'Course deleted successfully',
      deletedCourse,
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    next(error); // Forward the error to the error-handling middleware
  }
};
