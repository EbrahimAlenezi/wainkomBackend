import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./api/Auth/Auth.router";
import eventRoutes from "./api/Events/Event.router";
import userRoutes from "./api/User/User.router";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/user", userRoutes);
mongoose.connect(process.env.MONGODB_URI!);

app.listen(8000, () => console.log("Server running"));
