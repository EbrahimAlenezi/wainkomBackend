import { Router } from "express";
import { createOrganizer, updateOrganizer } from "./Organizer.controller";
import { authorize } from "../../Middleware/authorization";
import upload from "../../Middleware/multer";

const organizerRoutes = Router();

organizerRoutes.post("/", authorize, upload.single("image"), createOrganizer);
organizerRoutes.put("/:id", authorize, upload.single("image"), updateOrganizer);

export default organizerRoutes;