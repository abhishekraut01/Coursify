import express from 'express';
import cors from 'cors';
import errorMiddleware from './middlewares/errorMiddleware.js';
import adminRouter from './routes/admin.routes.js';
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/user', userRouter);

app.use(errorMiddleware);

export default app;
