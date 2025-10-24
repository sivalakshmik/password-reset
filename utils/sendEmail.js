import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (to, subject, text) => {
  try {
    const client = new Brevo.TransactionalEmailsApi();
    client.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const emailData = {
      sender: {
        email: process.env.SENDER_EMAIL,
        name: process.env.SENDER_NAME || "Password Reset",
      },
      to: [{ email: to }],
      subject,
      htmlContent: `
        <div style="font-family:Arial, sans-serif; line-height:1.6;">
          <h2 style="color:#0057B7;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Click the button below to continue:</p>
          <p>
            <a href="${text}" style="
              background-color:#FFCC00;
              color:black;
              padding:10px 20px;
              border-radius:5px;
              text-decoration:none;
              font-weight:bold;
            ">Reset Password</a>
          </p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <hr/>
          <p style="font-size:12px;color:#555;">© ${new Date().getFullYear()} Password Reset App</p>
        </div>
      `,
    };

    const result = await client.sendTransacEmail(emailData);
    console.log(
      `✅ Email sent successfully to ${to} at ${new Date().toLocaleString()}`
    );
    console.log("Message ID:", result?.messageId || "Success");
  } catch (error) {
    console.error(
      "❌ Email send failed:",
      error.response?.body?.message || error.message
    );
  }
};
