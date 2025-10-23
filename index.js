import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

/* ✅ FIX: Proper CORS configuration */
const allowedOrigins = [
  "http://localhost:3000",                   // for local development
  "https://passwordresetapp1.netlify.app",   // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or mobile apps)
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        const msg = `CORS policy: Origin ${origin} is not allowed.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* ✅ Middleware */
app.use(bodyParser.json());

/* ✅ Routes */
app.use("/api/auth", authRoutes);

/* ✅ MongoDB Connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

/* ✅ Start server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
