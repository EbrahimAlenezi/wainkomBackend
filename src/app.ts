import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "../src/Auth/Authrouter";
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
mongoose.connect(process.env.MONGODB_URI!);

app.listen(8000, () => console.log("Server running"));
