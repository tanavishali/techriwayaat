class ApiError extends Error {
  constructor(statusCode, errors) {
    super(Array.isArray(errors) ? errors[0] : errors);
    this.statusCode = statusCode;
    this.errors = Array.isArray(errors) ? errors : [errors];
  }
}

module.exports = ApiError;
