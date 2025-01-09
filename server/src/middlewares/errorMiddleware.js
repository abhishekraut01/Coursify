const errorMiddleware = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Check if the error is an instance of AppError
  if (err instanceof AppError) {
      return res.status(err.statusCode).json({
          success: false,
          message: err.message,
          errors: err.errors, // Custom error details
      });
  }

  // For unexpected errors
  console.error(err); // Log the error for debugging
  res.status(500).json({
      success: false,
      message: "Internal Server Error",
      stack: isDevelopment ? err.stack : undefined, // Include stack trace only in development
  });
};

export default errorMiddleware