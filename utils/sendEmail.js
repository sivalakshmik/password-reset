import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    // Create reusable transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // your Gmail app password
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Send the email
    const info = await transporter.sendMail({
      from: `"Password Reset" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`📧 Email sent successfully to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
};
