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
      htmlContent,
    };

    console.log("📧 Sending email...");
    console.log("➡️ To:", to);
    console.log("➡️ From:", process.env.SENDER_EMAIL);
    console.log("➡️ API Key starts with:", process.env.BREVO_API_KEY?.slice(0, 8));

    const response = await client.sendTransacEmail(emailData);
    console.log("✅ Email sent:", response?.messageId || "Success");
  } catch (error) {
    console.error("❌ Email send failed:");
    console.error("Status:", error.response?.status);
    console.error("Body:", error.response?.body);
    console.error("Message:", error.message);
  }
};
