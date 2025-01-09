const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';

  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
};

export default errorMiddleware;
