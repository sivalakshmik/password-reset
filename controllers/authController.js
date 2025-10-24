import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

// ======================= REGISTER =======================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ======================= LOGIN =======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================= FORGOT PASSWORD =======================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found with this email" });

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;
    console.log("🔗 Password Reset Link:", resetURL);

    // HTML email content
    const htmlContent = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;">
        <h2 style="color:#0057B7;">Password Reset Request</h2>
        <p>Hello ${user.name || "User"},</p>
        <p>You requested to reset your password. Click the button below to continue:</p>
        <p style="margin:20px 0;">
          <a href="${resetURL}" 
            style="background-color:#FFCC00;
            color:black;
            padding:10px 20px;
            border-radius:5px;
            text-decoration:none;
            font-weight:bold;">
            Reset My Password
          </a>
        </p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn’t request this, please ignore this email.</p>
        <hr/>
        <p style="font-size:12px;color:#777;">
          © ${new Date().getFullYear()} Password Reset App. All rights reserved.
        </p>
      </div>
    `;

    await sendEmail(email, "Password Reset Request", htmlContent);
    res.status(200).json({
      message:
        "Password reset link sent successfully. Please check your inbox or spam folder.",
    });
  } catch (err) {
    console.error("❌ Forgot password error:", err.message);
    res.status(500).json({ message: "Error sending reset link. Try again later." });
  }
};

// ======================= RESET PASSWORD =======================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired reset link" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful! You can now log in." });
  } catch (err) {
    console.error("❌ Reset password error:", err.message);
    res.status(500).json({ message: "Server error during password reset" });
  }
};
