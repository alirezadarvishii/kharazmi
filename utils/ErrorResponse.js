class ErrorResponse extends Error {
  constructor(statusCode, message, redirectionPath) {
    super(message);
    this.statusCode = statusCode;
    this.redirectionPath = redirectionPath;
  }
}

module.exports = ErrorResponse;
