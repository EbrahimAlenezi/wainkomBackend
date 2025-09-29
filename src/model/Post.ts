import { model, Schema, Types } from "mongoose";



const PostSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export const Post = model("Post", PostSchema);
