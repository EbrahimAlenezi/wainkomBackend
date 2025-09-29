import { Router } from "express";
import { getUser, updateUser, deleteUser, deleteAllUsers } from "./User.controller";

const userRoutes = Router();

userRoutes.get("/", getUser);
userRoutes.put("/", updateUser);
userRoutes.delete("/", deleteUser);
userRoutes.delete("/all", deleteAllUsers);

export default userRoutes;