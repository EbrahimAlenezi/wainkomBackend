import { Router } from "express";
import { createCategory, getCategories } from "./Category.controller";
import { authorize } from "../../Middleware/authorization";

const categoryRoutes = Router();

categoryRoutes.post("/", authorize, createCategory);
categoryRoutes.get("/", getCategories);

export default categoryRoutes;