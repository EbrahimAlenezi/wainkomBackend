import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./api/Auth/Auth.router";
import eventRoutes from "./api/Events/Event.router";
import userRoutes from "./api/User/User.router";
import categoryRoutes from "./api/Category/Category.router";
import organizerRoutes from "./api/Organizer/Organizer.router";
import morgan from "morgan";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/organizer", organizerRoutes);
mongoose.connect(process.env.MONGODB_URI!);

app.listen(8000, () => console.log("Server running"));
