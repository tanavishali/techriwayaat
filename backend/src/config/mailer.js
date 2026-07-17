const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = {
  async sendMail({ from, to, replyTo, subject, text, html, attachments }) {
    const { error } = await resend.emails.send({
      from,
      to,
      reply_to: replyTo,
      subject,
      text,
      html,
      attachments: attachments?.map(({ filename, content }) => ({ filename, content })),
    });

    if (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = transporter;
