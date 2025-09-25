import { model, Schema, Types } from "mongoose";



const RoutSchema = new Schema(
  {
    eventsId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    attendance: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Rout = model("Rout", RoutSchema);
