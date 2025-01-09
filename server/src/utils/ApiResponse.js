class ApiResponse {
  constructor(success, message ="success", data = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success(message, data) {
    return new ApiResponse(true, message, data);
  }

  static error(message, data = null) {
    return new ApiResponse(false, message, data);
  }
}

export default ApiResponse