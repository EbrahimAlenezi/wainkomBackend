import { Router } from "express";
import { createOrganizer, updateOrganizer, getMyOrganizer, assignEventToOrganizer, addEventToOrganizer, removeEventFromOrganizer, updateOrganizerEvents, getOrganizer } from "./Organizer.controller";
import { authorize } from "../../Middleware/authorization";
import upload from "../../Middleware/multer";

const organizerRoutes = Router();

// Debug middleware for organizer routes
organizerRoutes.use((req, res, next) => {
  console.log(`Organizer route: ${req.method} ${req.path}`);
  next();
});

organizerRoutes.get("/my-profile", authorize, getMyOrganizer);
organizerRoutes.get("/:id", authorize, getOrganizer);
organizerRoutes.post("/", authorize, upload.single("image"), createOrganizer);
organizerRoutes.put("/:id", authorize, upload.single("image"), updateOrganizer);
organizerRoutes.post("/assign-event", authorize, assignEventToOrganizer);
organizerRoutes.post("/add-event", authorize, addEventToOrganizer);
organizerRoutes.post("/remove-event", authorize, removeEventFromOrganizer);
organizerRoutes.put("/events/:organizerId", authorize, updateOrganizerEvents);

export default organizerRoutes;