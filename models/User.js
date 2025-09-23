import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpire: { type: Date }
});

export default mongoose.model("PasswordDB", userSchema);
