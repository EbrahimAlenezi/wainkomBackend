import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventByCategory,
  updateEvent,
  deleteEvent,
  getEventsByOrg,
  savedEvent,
  getEventById,
} from "./Event.controller";
import { authorize } from "../../Middleware/authorization";
import upload from "../../Middleware/multer";

const eventRoutes = Router();

// Create (with multer)
eventRoutes.post("/", authorize, upload.single("image"), createEvent);

// Read lists
eventRoutes.get("/", getEvents);
eventRoutes.get("/org/:orgId", getEventsByOrg);
eventRoutes.get("/category/:categoryId", getEventByCategory);

// Read single
eventRoutes.get("/event/:eventId", getEventById);

// Engagement (make path explicit to avoid clashing with :id)
eventRoutes.post("/event/:eventId/save", savedEvent);

// Update/Delete (keep these AFTER the specific routes)
eventRoutes.put("/:id", authorize, upload.single("image"), updateEvent);
eventRoutes.delete("/:id", authorize, deleteEvent);

export default eventRoutes;
