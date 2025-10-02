// controllers/engagement.controller.ts
import { Request, Response } from "express";
import { Engagment } from "../model/Engagment"; // مسار الموديل
import { Event } from "../model/Event";
export const saveEngagement = async (req: Request, res: Response) => {
  try {
    const { userId, eventId } = req.body;

    // لو محفوظ من قبل ما يتكرر
    const exists = await Engagment.findOne({ user: userId, event: eventId });
    if (exists) {
      return res.status(400).json({ message: "Already saved" });
    }

    const engagement = new Engagment({ user: userId, event: eventId });
    await engagement.save();

    res.status(201).json(engagement);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getUserEngagements = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const engagements = await Engagment.find({ user: userId })
      .populate("event") // يجيب بيانات الايفنت كاملة
      .sort({ createdAt: -1 });

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
