import { Request, Response } from "express";
import { Event } from "../../model/Event";
import { Review } from "../../model/Reviews";
import { Engagment } from "../../model/Engagment";

async function recomputeEventRating(eventId: string) {
  const [agg] = await Review.aggregate([
    { $match: { eventId: (Event as any).db.base.Types.ObjectId.createFromHexString(eventId) } },
    { $group: { _id: "$eventId", averageRating: { $avg: "$rating" }, ratingsCount: { $count: {} } } },
  ]);
  const averageRating = agg ? Number(agg.averageRating.toFixed(2)) : 0;
  const ratingsCount = agg ? agg.ratingsCount : 0;
  await Event.findByIdAndUpdate(eventId, { averageRating, ratingsCount });
}

export const submitRating = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { eventId } = req.params;
    const { rating, text } = req.body;

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "rating must be a number between 1 and 5" });
    }
    if (text && (typeof text !== "string" || text.length > 200)) {
      return res.status(400).json({ message: "text must be a string up to 200 characters" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Rating option appears after the exact event date and time has passed
    const [hh, mm] = (event.time || "00:00").split(":").map(Number);
    const eventDateTime = new Date(event.date);
    eventDateTime.setHours(hh ?? 0, mm ?? 0, 0, 0);
    const now = new Date();
    if (eventDateTime > now) {
      return res.status(400).json({ message: "You can rate only after the event time has passed" });
    }

    // Users can only rate events they engaged with (no attendance required)
    const engaged = await Engagment.findOne({ event: event._id, user: authUser._id });
    if (!engaged) {
      return res.status(403).json({ message: "Only engaged users can rate this event" });
    }

    // Enforce one-time submission: reject if review already exists
    const exists = await Review.findOne({ eventId: event._id, userId: authUser._id });
    if (exists) {
      return res.status(409).json({ message: "You have already rated this event" });
    }

    const review = await Review.create({ eventId: event._id, userId: authUser._id, rating, text });

    await recomputeEventRating(event._id.toString());

    return res.status(201).json({ message: "Rating submitted", review });
  } catch (err: any) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "You have already rated this event" });
    }
    return res.status(500).json({ error: err?.message || err });
  }
};

export const getEventReviews = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const reviews = await Review.find({ eventId }).populate("userId", "name email");
    return res.status(200).json(reviews);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

export const getMyReview = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { eventId } = req.params;
    const review = await Review.findOne({ eventId, userId: authUser._id });
    return res.status(200).json(review);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

export const getEventRatingSummary = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).select("averageRating ratingsCount");
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.status(200).json({ averageRating: event.averageRating, ratingsCount: event.ratingsCount });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};


export const upsertReviewText = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { eventId } = req.params;
    const { text } = req.body;

    if (text && (typeof text !== "string" || text.length > 200)) {
      return res.status(400).json({ message: "text must be a string up to 200 characters" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const review = await Review.findOneAndUpdate(
      { eventId, userId: authUser._id },
      { $set: { text: text ?? "" } },
      { new: true }
    );
    if (!review) {
      return res.status(400).json({ message: "Submit a rating first before adding a text review" });
    }

    return res.status(200).json(review);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
