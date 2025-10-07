import { Request, Response } from "express";
import path from "path"; // kept in case you need it later
import { Event } from "../../model/Event";
import { Org } from "../../model/Organizer";
import { User } from "../../model/User";
import { Review } from "../../model/Reviews";

// ---- helper: normalize any incoming "location" into GeoJSON Point ----
function toGeoPoint(input: any) {
  try {
    // If it's a JSON-looking string, parse it
    if (
      typeof input === "string" &&
      (input.trim().startsWith("[") || input.trim().startsWith("{"))
    ) {
      input = JSON.parse(input);
    }

    // If it's already a GeoJSON object
    if (input && typeof input === "object" && !Array.isArray(input)) {
      if (input.type === "Point" && Array.isArray(input.coordinates)) {
        const [lng, lat] = input.coordinates.map(Number);
        if (Number.isFinite(lng) && Number.isFinite(lat)) {
          return { type: "Point", coordinates: [lng, lat] as [number, number] };
        }
      }
    }

    // If it's an array [lng, lat]
    if (Array.isArray(input) && input.length === 2) {
      const [a, b] = input.map(Number);
      if (Number.isFinite(a) && Number.isFinite(b)) {
        return { type: "Point", coordinates: [a, b] as [number, number] };
      }
    }

    // If it's a plain "lng,lat" string
    if (typeof input === "string" && input.includes(",")) {
      const parts = input.split(",").map((s) => Number(s.trim()));
      if (parts.length === 2 && parts.every(Number.isFinite)) {
        return {
          type: "Point",
          coordinates: [parts[0], parts[1]] as [number, number],
        };
      }
    }
  } catch {
    // ignore and fall through
  }
  return null;
}

// Create Event
export const createEvent = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check user + organizer
    const user = await User.findById(authUser._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.isOrganizer !== true) {
      return res
        .status(403)
        .json({ message: "Only organizers can create events" });
    }

    // Organizer profile
    const organizer = await Org.findOne({ owner: authUser._id });
    if (!organizer) {
      return res.status(403).json({
        message:
          "Organizer profile not found. Please create your organizer profile first.",
      });
    }

    const {
      title,
      description,
      image,
      location,
      date,
      time,
      duration,
      categoryId,
    } = req.body;

    // Multer image (public path)
    const file = (req as any).file as Express.Multer.File | undefined;
    const uploadedImagePath = file ? `/uploads/${file.filename}` : null;
    const imageToSave = uploadedImagePath || image;

    // Robust location handling
    const geoLocation = toGeoPoint(location);
    if (!geoLocation) {
      return res
        .status(400)
        .json({
          message:
            "location must be [lng,lat], 'lng,lat', a JSON string of that, or a GeoJSON Point",
        });
    }

    // Date validation
    const eventDate = typeof date === "string" ? new Date(date) : date;
    if (!(eventDate instanceof Date) || isNaN(eventDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const event = await Event.create({
      title,
      description,
      image: imageToSave,
      location: geoLocation,
      date: eventDate,
      time,
      duration,
      orgId: organizer._id,
      categoryId: categoryId,
    });

    // Link to organizer
    const updatedOrg = await Org.findByIdAndUpdate(
      organizer._id,
      { $push: { events: event._id } },
      { new: true }
    );

    console.log("Event created:", event._id);
    console.log("Event title:", event.title);
    console.log("Organizer ID:", organizer._id);
    console.log("Organizer events after update:", updatedOrg?.events);

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getEventByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const events = await Event.find({ categoryId });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Update Event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updates: any = { ...req.body };

    // If new file uploaded, overwrite image with public path
    const file = (req as any).file as Express.Multer.File | undefined;
    if (file) {
      updates.image = `/uploads/${file.filename}`;
    }

    // If location included, normalize it
    if (updates.location !== undefined) {
      const parsed = toGeoPoint(updates.location);
      if (!parsed) {
        return res
          .status(400)
          .json({
            message:
              "location must be [lng,lat], 'lng,lat', a JSON string of that, or a GeoJSON Point",
          });
      }
      updates.location = parsed;
    }

    const event = await Event.findByIdAndUpdate(id, updates, { new: true });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Delete Event
export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Event.findByIdAndDelete(id);
  res.status(200).json({ message: "Event deleted" });
};

// Events by Organizer
export const getEventsByOrg = async (req: Request, res: Response) => {
  const { orgId } = req.params;
  const events = await Event.find({ orgId });
  res.status(200).json(events);
};

// Save/bookmark Event
export const savedEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params as any;
  const { userId } = req.body;
  const event = await Event.findByIdAndUpdate(eventId, {
    $push: { bookmarks: userId },
  });
  res.status(200).json(event);
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
