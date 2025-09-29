import { Request, Response } from "express";
import { Event } from "../../model/Event";
import { User } from "../../model/User";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(authUser._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.isOrganizer !== true) {
      return res.status(403).json({ message: "User is not an organizer" });
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
      orgId: user._id,
      categoryId: categoryId,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  const events = await Event.find();
  res.status(200).json(events);
};

export const getEventByCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const events = await Event.find({ categoryId });
  res.status(200).json(events);
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, image, location, date, time } = req.body;
  const event = await Event.findByIdAndUpdate(id, { title, description, image, location, date, time });
  res.status(200).json(event);
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Event.findByIdAndDelete(id);
  res.status(200).json({ message: "Event deleted" });
};

export const getEventsByOrg = async (req: Request, res: Response) => {
  const { orgId } = req.params;
  const events = await Event.find({ orgId });
  res.status(200).json(events);
}; 

export const savedEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  const event = await Event.findByIdAndUpdate(id, { $push: { bookmarks: userId } });
  res.status(200).json(event);
};

