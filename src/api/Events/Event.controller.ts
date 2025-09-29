import { Request, Response } from "express";
import { Event } from "../../model/Event";
import { User } from "../../model/User";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token });
    if (user?.isOrganizer === true) {
    const { title, description, image, location, date, time, duration } = req.body;
      const event = await Event.create({ title, description, image, location, date, time, duration, orgId: user._id });
      res.status(201).json(event);
    } else {
      return res.status(400).json({ msg: "User is not an organizer" });
    }
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

