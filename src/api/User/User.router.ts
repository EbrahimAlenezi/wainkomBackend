import { Router } from "express";
import { getUsers, updateUser, deleteUser, deleteAllUsers, getUserById } from "./User.controller";
import { authorize } from "../../Middleware/authorization";
import upload from "../../Middleware/multer";

const userRoutes = Router();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUserById);

userRoutes.put("/", authorize, upload.single("image"), updateUser);
userRoutes.delete("/", authorize, deleteUser);
userRoutes.delete("/all", deleteAllUsers);

export default userRoutes;