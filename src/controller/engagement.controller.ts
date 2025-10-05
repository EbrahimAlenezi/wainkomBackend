// controllers/engagement.controller.ts
import { Request, Response } from "express";
import { Engagment } from "../model/Engagment"; // مسار الموديل
import { Event } from "../model/Event";
import { Types } from "mongoose";

export const saveEngagement = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const { eventId } = req.body;

    // Ensure proper ObjectId type
    const exists = await Engagment.findOne({
      user: userId,
      event: new Types.ObjectId(eventId),
    });

    if (exists) {
      // Return the existing document instead of 400
      return res.status(200).json(exists);
    }

    const engagement = new Engagment({
      user: userId,
      event: new Types.ObjectId(eventId),
    });

    await engagement.save();
    const populatedEngagement = await engagement.populate("event");
    res.status(201).json(populatedEngagement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

export const getUserEngagements = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const engagements = await Engagment.find({ user: userId }).populate(
      "event"
    );

    res.json(engagements);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const removeEngagement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Engagment.findByIdAndDelete(id);

    res.json({ message: "Removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
