class ApiResponse {
    constructor(statusCode, message = "success", data) {
        this.statusCode = statusCode; // HTTP status code (e.g., 200, 404, 500)
        this.message = message;      // Response message (e.g., "success", "not found", etc.)
        this.data = data;            // Response payload (e.g., any JSON data)
        this.success = statusCode < 400; // Automatically set true for 2xx and 3xx, false otherwise
    }
}

export default ApiResponse;