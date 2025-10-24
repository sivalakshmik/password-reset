import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  pool: true,
  maxConnections: 1,
  maxMessages: 5,
  rateLimit: 1, // avoid Gmail throttling
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text) => {
  const start = Date.now();
  try {
    const info = await transporter.sendMail({
      from: `"Password Reset" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `<p>${text}</p>`,
    });
    console.log(
      `✅ Sent to ${to} in ${(Date.now() - start) / 1000}s (${info.response})`
    );
  } catch (e) {
    console.error(`❌ Email to ${to} failed:`, e.message);
  }
};
