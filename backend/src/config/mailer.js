const { Resend } = require("resend");

console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
console.log(
  "RESEND_API_KEY prefix:",
  process.env.RESEND_API_KEY?.substring(0, 5)
);

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = {
  async sendMail({ from, to, replyTo, subject, text, html, attachments }) {
    const { data, error } = await resend.emails.send({
      from,
      to,
      reply_to: replyTo,
      subject,
      text,
      html,
      attachments: attachments?.map(({ filename, content }) => ({
        filename,
        content,
      })),
    });

    console.log("Resend Response:", { data, error });

    if (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = transporter;