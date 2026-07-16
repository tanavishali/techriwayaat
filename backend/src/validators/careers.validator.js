const ApiError = require("../utils/ApiError");
const { JOBS_CATALOG } = require("../config/jobsCatalog");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d\s-]{7,20}$/;
const URL_RE = /^https?:\/\/.+/i;

function validateJobApplication(req, res, next) {
  const { fullName, email, phone, linkedin, portfolio, coverLetter } = req.body || {};
  const errors = [];

  const job = JOBS_CATALOG.find((j) => j.id === Number(req.params.jobId));
  if (!job) errors.push("Job not found.");

  if (!fullName || !fullName.trim()) errors.push("Full name is required.");
  if (!email || !EMAIL_RE.test(email)) errors.push("A valid email is required.");
  if (!phone || !PHONE_RE.test(phone)) errors.push("A valid phone number is required.");
  if (!coverLetter || !coverLetter.trim()) errors.push("Cover letter is required.");
  if (linkedin && !URL_RE.test(linkedin)) errors.push("LinkedIn link must be a valid URL.");
  if (portfolio && !URL_RE.test(portfolio)) errors.push("Portfolio link must be a valid URL.");
  if (!req.file) errors.push("CV file is required.");

  if (errors.length) {
    return next(new ApiError(400, errors));
  }

  req.job = job;
  next();
}

module.exports = { validateJobApplication };
