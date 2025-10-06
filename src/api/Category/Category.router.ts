import { Router } from "express";
import { createCategory, getCategories,updateCategory } from "./Category.controller";
import { authorize } from "../../Middleware/authorization";

const categoryRoutes = Router();

categoryRoutes.post("/", authorize, createCategory);
categoryRoutes.get("/", getCategories);
categoryRoutes.patch('/:id', updateCategory); 


export default categoryRoutes;