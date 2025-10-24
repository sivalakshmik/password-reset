import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const client = new Brevo.TransactionalEmailsApi();
    client.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const emailData = {
      sender: {
        email: process.env.SENDER_EMAIL,
        name: process.env.SENDER_NAME || "Password Reset App",
      },
      to: [{ email: to }],
      subject,
      htmlContent, // ✅ ensures clickable HTML
    };

    const result = await client.sendTransacEmail(emailData);
    console.log(`✅ Email sent to ${to}:`, result?.messageId || "Success");
  } catch (error) {
    console.error(
      "❌ Email send failed:",
      error.response?.body?.message || error.message
    );
  }
};
