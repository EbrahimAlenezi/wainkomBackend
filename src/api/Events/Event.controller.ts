import { Request, Response } from "express";
import { Event } from "../../model/Event";
import { Org } from "../../model/Organizer";
import { User } from "../../model/User";
// Create Event is Working
export const createEvent = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user exists and is an organizer
    const user = await User.findById(authUser._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.isOrganizer !== true) {
      return res.status(403).json({ message: "Only organizers can create events" });
    }

    // Find the organizer profile for this user
    const organizer = await Org.findOne({ owner: authUser._id });
    if (!organizer) {
      return res.status(403).json({ message: "Organizer profile not found. Please create your organizer profile first." });
    }


    const { title, description, image, location, date, time, duration, categoryId } = req.body;

    let geoLocation: any = location;
    if (Array.isArray(location)) {
      if (location.length !== 2) {
        return res.status(400).json({ message: "location must be [lng, lat]" });
      }
      const [lngRaw, latRaw] = location;
      const lng = Number(lngRaw);
      const lat = Number(latRaw);
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
        return res.status(400).json({ message: "location coordinates must be numbers" });
      }
      geoLocation = { type: "Point", coordinates: [lng, lat] };
    }

    const eventDate = typeof date === "string" ? new Date(date) : date;
    if (!(eventDate instanceof Date) || isNaN(eventDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const event = await Event.create({
      title,
      description,
      image,
      location: geoLocation,
      date: eventDate,
      time,
      duration,
      orgId: organizer._id,
      categoryId: categoryId,
    });

    // Add the event to the organizer's events array
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
// Working
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
// Working
export const getEventByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const events = await Event.find({ categoryId });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
// Working
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const event = await Event.findByIdAndUpdate(id, updates, { new: true });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
// needs testing
export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Event.findByIdAndDelete(id);
  res.status(200).json({ message: "Event deleted" });
};
// needs testing
export const getEventsByOrg = async (req: Request, res: Response) => {
  const { orgId } = req.params;
  const events = await Event.find({ orgId });
  res.status(200).json(events);
}; 
// needs testing
export const savedEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  const event = await Event.findByIdAndUpdate(id, { $push: { bookmarks: userId } });
  res.status(200).json(event);
};

export const getEventById = async (req: Request, res: Response) => {
  try {
  const { id } = req.params;
  const event = await Event.findById(id);
  res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
