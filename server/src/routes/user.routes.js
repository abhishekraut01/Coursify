import express from 'express';
const userRouter = express.Router();

// POST routes for creating resources or performing actions
userRouter.post('/signup', (req, res) => {
  // Logic for signing up
});

userRouter.post('/login', (req, res) => {
  // Logic for logging in
});

userRouter.post('/logout', (req, res) => {
  // Logic for logging out
});

userRouter.post('/courses/:courseId', (req, res) => {
    //logic for purchase course
});

// GET route to fetch courses (reading data)
userRouter.get('/courses', (req, res) => {
  // Logic to get all courses
});

userRouter.get('/courses/purchasedCourses', (req, res) => {
  // Logic to get all courses
});

// DELETE route for deleting a course (removing a resource)
userRouter.delete('/courses/:courseId', (req, res) => {
  // Logic for deleting a purchased course
});

export default userRouter;
