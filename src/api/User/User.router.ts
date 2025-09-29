import { Router } from "express";
import { getUser, updateUser, deleteUser, deleteAllUsers } from "./User.controller";
import { authorize } from "../../Middleware/authorization";

const userRoutes = Router();

userRoutes.get("/", getUser);
userRoutes.put("/", authorize, updateUser);
userRoutes.delete("/", authorize, deleteUser);
userRoutes.delete("/all", deleteAllUsers);

export default userRoutes;