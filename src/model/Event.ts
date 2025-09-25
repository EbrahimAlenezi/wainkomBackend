import { Schema, Types,Document, model, Model } from "mongoose";




const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    image: String,
    location: String,
    date: { type: Date, required: true },
    time: String,
    post: String,
    links:String,
    orgId: { type: Schema.Types.ObjectId, ref: "Org", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

export const Event = model("Event", EventSchema);
