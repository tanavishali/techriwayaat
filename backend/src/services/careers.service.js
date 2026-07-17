const transporter = require("../config/mailer");
const ApiError = require("../utils/ApiError");
const JobApplication = require("../models/jobApplication.model");
const { JOBS_CATALOG, APPLICATION_LIMIT_PER_JOB } = require("../config/jobsCatalog");

async function getApplicationCounts() {
  const counts = await JobApplication.aggregate([{ $group: { _id: "$jobId", count: { $sum: 1 } } }]);
  const countByJobId = Object.fromEntries(counts.map((c) => [c._id, c.count]));

  return JOBS_CATALOG.map((job) => ({
    jobId: job.id,
    count: countByJobId[job.id] || 0,
    limit: APPLICATION_LIMIT_PER_JOB,
  }));
}

function buildMailOptions({ job, fullName, email, phone, linkedin, portfolio, coverLetter, cv }) {
  return {
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: process.env.COMPANY_EMAIL,
    replyTo: email,
    subject: `New internship application — ${job.title}`,
    text: [
      `Position: ${job.title}`,
      `Full name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      linkedin ? `LinkedIn: ${linkedin}` : null,
      portfolio ? `Portfolio: ${portfolio}` : null,
      "",
      "Cover letter:",
      coverLetter,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <h2>New internship application</h2>
      <p><strong>Position:</strong> ${job.title}</p>
      <p><strong>Full name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${linkedin ? `<p><strong>LinkedIn:</strong> ${linkedin}</p>` : ""}
      ${portfolio ? `<p><strong>Portfolio:</strong> ${portfolio}</p>` : ""}
      <p><strong>Cover letter:</strong><br/>${coverLetter.replace(/\n/g, "<br/>")}</p>
    `,
    attachments: [
      {
        filename: cv.originalname,
        content: cv.buffer,
      },
    ],
  };
}

async function submitApplication({ job, fullName, email, phone, linkedin, portfolio, coverLetter, cv }) {
  const existingCount = await JobApplication.countDocuments({ jobId: job.id });
  if (existingCount >= APPLICATION_LIMIT_PER_JOB) {
    throw new ApiError(409, `Applications for ${job.title} have reached the limit of ${APPLICATION_LIMIT_PER_JOB}.`);
  }

  try {
    await transporter.sendMail(
      buildMailOptions({ job, fullName, email, phone, linkedin, portfolio, coverLetter, cv })
    );
  } catch (mailErr) {
    console.error("Failed to send application email:", mailErr.message);
    throw new ApiError(502, "Failed to submit your application. Please try again later.");
  }

  await JobApplication.create({
    jobId: job.id,
    jobTitle: job.title,
    fullName,
    email,
    phone,
    linkedin,
    portfolio,
    coverLetter,
    cvFileName: cv.originalname,
  });
}

module.exports = { getApplicationCounts, submitApplication };
