/**
 * Custom application error class
 */
class AppError extends Error {
    /**
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code
     * @param {Array} errors - Additional error details
     * @param {string} stack - Stack trace 
     */
    constructor(
        message = "Internal server Error",
        statusCode = 500,
        errors = [],
        stack = ''
    ) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.isOperational = true;

        // Handle the stack trace
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor); // Auto-capture stack trace
        }
    }
}

export default AppError



