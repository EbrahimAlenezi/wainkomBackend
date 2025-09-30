import { Router } from "express";
import { createOrganizer, updateOrganizer, getMyOrganizer, assignEventToOrganizer, addEventToOrganizer, removeEventFromOrganizer, updateOrganizerEvents } from "./Organizer.controller";
import { authorize } from "../../Middleware/authorization";

const organizerRoutes = Router();

// Debug middleware for organizer routes
organizerRoutes.use((req, res, next) => {
  console.log(`Organizer route: ${req.method} ${req.path}`);
  next();
});

organizerRoutes.get("/my-profile", authorize, getMyOrganizer);
organizerRoutes.post("/", authorize, createOrganizer);
organizerRoutes.put("/:id", authorize, updateOrganizer);
organizerRoutes.post("/assign-event", authorize, assignEventToOrganizer);
organizerRoutes.post("/add-event", authorize, addEventToOrganizer);
organizerRoutes.post("/remove-event", authorize, removeEventFromOrganizer);
organizerRoutes.put("/events/:organizerId", authorize, updateOrganizerEvents);

export default organizerRoutes;