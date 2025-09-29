import { Schema, Types, model} from "mongoose";

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

const EventSchema = new Schema(
  {
    //input information
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    location: pointSchema,
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
    links: { type: String },
    orgId: { type: Schema.Types.ObjectId, ref: "Org", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    //interactive after event is created
    posts: { type: Schema.Types.ObjectId, ref: "Post" },
    engagements: { type: Schema.Types.ObjectId, ref: "UserEvent" },
  },
  { timestamps: true }
);

export const Event = model("Event", EventSchema);
