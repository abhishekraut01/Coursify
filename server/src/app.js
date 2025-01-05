import express from 'express';
import cors from 'cors';
import adminController from './controllers/adminController.js';
import userController from './controllers/userController.js';
import errorMiddleware from './middlewares/errorMiddleware.js'; 

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use('/api/v1/admin', adminController);
app.use('/api/v1/user', userController);

// Global Error Handler - Catch any unhandled errors from routes
app.use(errorMiddleware);

export default app;
