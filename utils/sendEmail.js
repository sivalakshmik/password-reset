import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Password Reset" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `<p>${text}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${to}: ${info.response}`);
  } catch (error) {
    console.error("❌ Email send failed:", error.response || error.message);
  }
};
