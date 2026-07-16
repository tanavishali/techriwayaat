const ApiError = require("../utils/ApiError");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d\s-]{7,20}$/;

function validateContact(req, res, next) {
  const { fullName, email, phone, service, message } = req.body || {};
  const errors = [];

  if (!fullName || !fullName.trim()) errors.push("Full name is required.");
  if (!email || !EMAIL_RE.test(email)) errors.push("A valid email is required.");
  if (!phone || !PHONE_RE.test(phone)) errors.push("A valid phone number is required.");
  if (!service || !service.trim()) errors.push("Service is required.");
  if (!message || !message.trim()) errors.push("Message is required.");

  if (errors.length) {
    return next(new ApiError(400, errors));
  }

  next();
}

module.exports = { validateContact };
