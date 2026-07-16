const multer = require("multer");
const ApiError = require("../utils/ApiError");

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, errors: err.errors });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, errors: [err.message] });
  }

  console.error(err);
  res.status(500).json({ success: false, errors: ["Internal server error"] });
}

module.exports = errorHandler;
