const asyncHandler = require("../utils/asyncHandler");
const { getApplicationCounts, submitApplication } = require("../services/careers.service");

const getCounts = asyncHandler(async (req, res) => {
  const counts = await getApplicationCounts();
  res.status(200).json({ success: true, counts });
});

const applyToJob = asyncHandler(async (req, res) => {
  const { fullName, email, phone, linkedin, portfolio, coverLetter } = req.body;

  await submitApplication({
    job: req.job,
    fullName,
    email,
    phone,
    linkedin,
    portfolio,
    coverLetter,
    cv: req.file,
  });

  res.status(201).json({ success: true, message: "Application submitted successfully." });
});

module.exports = { getCounts, applyToJob };
