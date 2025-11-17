class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.message = message || "Something went wrong";
    this.statusCode = statusCode;
    this.data = null;
    this.status = statusCode >= 400 && statusCode < 500 ? "client error" : "server error";
    this.isOperational = true;
    Error.captureStackTrace(this, CustomError);
  }
}
module.exports = { CustomError };
