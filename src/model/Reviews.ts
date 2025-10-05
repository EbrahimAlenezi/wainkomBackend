import { model, Schema, Types } from "mongoose";



const ReviewSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, maxlength: 200 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


ReviewSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const Review = model("Review", ReviewSchema);
