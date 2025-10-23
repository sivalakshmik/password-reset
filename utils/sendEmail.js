import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (to, subject, text) => {
  try {
    const client = new Brevo.TransactionalEmailsApi();
    client.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const email = {
      sender: { email: process.env.SENDER_EMAIL, name: process.env.SENDER_NAME },
      to: [{ email: to }],
      subject,
      textContent: text,
    };

    const result = await client.sendTransacEmail(email);
    console.log("✅ Email sent successfully:", result.messageId);
  } catch (error) {
    console.error("❌ Email send failed:", error.response?.body || error.message);
  }
};
