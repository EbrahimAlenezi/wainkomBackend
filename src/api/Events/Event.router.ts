import { Router } from "express";
import { createEvent, getEvents, getEventByCategory, updateEvent, deleteEvent, getEventsByOrg, savedEvent } from "./Event.controller";
import { authorize } from "../../Middleware/authorization";

const eventRoutes = Router();

eventRoutes.post("/", authorize, createEvent);
eventRoutes.get("/", getEvents);
eventRoutes.get("/:categoryId", getEventByCategory);
eventRoutes.put("/:id", authorize, updateEvent);
eventRoutes.delete("/:id", authorize, deleteEvent);
eventRoutes.get("/org/:orgId", getEventsByOrg);
eventRoutes.post("/:eventId/save", savedEvent);

export default eventRoutes;