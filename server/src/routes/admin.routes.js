import express from 'express';
const adminRouter = express.Router();
import {
  adminSignUp,
  adminLogin,
  adminLogout,
  adminGetCourses,
  adminAddCourses,
  adminUpdateCourse,
  adminDeleteCourse,
} from '../controllers/admin.controller.js';

// POST routes for creating resources or performing actions
adminRouter.post('/signup', adminSignUp);

adminRouter.post('/login', adminLogin);

adminRouter.post('/logout', adminLogout);

// GET route to fetch courses (reading data)
adminRouter.get('/courses', adminGetCourses);

// POST route to create a new course (adding a resource)
adminRouter.post('/courses',handleAdminAuth, adminAddCourses);

// PUT route for updating a course (modify an existing resource)
adminRouter.put('/courses/:courseId', handleAdminAuth, adminUpdateCourse);

// DELETE route for deleting a course (removing a resource)
adminRouter.delete('/courses/:courseId',handleAdminAuth , adminDeleteCourse);

export default adminRouter;
