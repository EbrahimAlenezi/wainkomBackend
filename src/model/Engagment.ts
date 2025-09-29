import { model, Schema, Types } from "mongoose";

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const UserEventSchma = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // location: pointSchema,
    // engagement: { type: String, required: true },
    attended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Engagment = model("UserEvent", UserEventSchma);
