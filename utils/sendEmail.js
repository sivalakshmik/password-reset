import axios from "axios";
import FormData from "form-data";

export const sendEmail = async (to, subject, text) => {
  try {
    const form = new FormData();
    form.append("from", "Booking App <mailgun@sandbox12345.mailgun.org>");
    form.append("to", to);
    form.append("subject", subject);
    form.append("text", text);

    const response = await axios.post(
      "https://api.mailgun.net/v3/sandbox12345.mailgun.org/messages",
      form,
      {
        auth: {
          username: "api",
          password: process.env.MAILGUN_API_KEY,
        },
        headers: form.getHeaders(),
      }
    );

    console.log(`📧 Email sent successfully to ${to}: ${response.data.id}`);
  } catch (error) {
    console.error("❌ Mailgun email failed:", error.response?.data || error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
};
