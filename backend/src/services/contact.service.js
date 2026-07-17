const transporter = require("../config/mailer");
const ApiError = require("../utils/ApiError");

function buildMailOptions({ fullName, email, phone, service, message }) {
  return {
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: process.env.COMPANY_EMAIL,
    replyTo: email,
    subject: `New contact form submission — ${service}`,
    text: [
      `Full name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Service interested: ${service}`,
      "",
      "Message:",
      message,
    ].join("\n"),
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Full name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Service interested:</strong> ${service}</p>
      <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
    `,
  };
}

async function submitContact(payload) {
  try {
    console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
    console.log("COMPANY_EMAIL:", process.env.COMPANY_EMAIL);

    await transporter.sendMail(buildMailOptions(payload));
  } catch (mailErr) {
    console.error("Mail Error:", mailErr);
    console.error("Failed to send contact email:", mailErr.message);

    throw new ApiError(
      502,
      "Failed to send your message. Please try again later."
    );
  }
}

module.exports = { submitContact };