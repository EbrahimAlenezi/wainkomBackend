import { Router } from "express";
import { createEvent, getEvents, getEventByCategory, updateEvent, deleteEvent, getEventsByOrg, savedEvent, getEventById } from "./Event.controller";
import { authorize } from "../../Middleware/authorization";
import upload from "../../Middleware/multer";

const eventRoutes = Router();

eventRoutes.post("/", authorize, upload.single("image"), createEvent);
eventRoutes.get("/", getEvents);
eventRoutes.get("/:categoryId", getEventByCategory);
eventRoutes.put("/:id", authorize, updateEvent);
eventRoutes.delete("/:id", authorize, deleteEvent);
eventRoutes.get("/org/:orgId", getEventsByOrg);
eventRoutes.post("/:eventId/save", savedEvent);
eventRoutes.get("/event/:eventId", getEventById);

export default eventRoutes;