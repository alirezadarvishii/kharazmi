class ApiError extends Error {
  constructor(error, isOperational = true) {
    super(error.message);
    this.statusCode = error.statusCode;
    this.code = error.code;
    this.redirectionPath = error.redirectionPath;
    this.isOperational = isOperational;
  }
}

module.exports = ApiError;
