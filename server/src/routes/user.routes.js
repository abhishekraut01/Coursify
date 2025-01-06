import express from 'express';
const userRouter = express.Router();
import {
  userSignUp,
  userLogin,
  userLogout,
  userPurchaseCourse,
  userGetAllCourses,
  userGetPurchasedCourses,
  userDeletePurchasedCourse,
} from '../controllers/user.controller.js';

// POST routes for creating resources or performing actions
userRouter.post('/signup', userSignUp);

userRouter.post('/login', userLogin);

userRouter.post('/logout', userLogout);

userRouter.patch('/courses/:courseId', userPurchaseCourse);

// GET route to fetch courses (reading data)
userRouter.get('/courses', userGetAllCourses);

userRouter.get('/courses/purchasedCourses', userGetPurchasedCourses);

// DELETE route for deleting a course (removing a resource)
userRouter.delete('/courses/:courseId', userDeletePurchasedCourse);

export default userRouter;
