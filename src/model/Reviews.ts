import { model, Schema, Types } from "mongoose";



const ReviewSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    
  },
  { timestamps: true }
);

export const Review = model("Review", ReviewSchema);
