import { Schema, model, Types } from "mongoose";



const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    bio: { type: String },
    phone: { type: String },
    engagements: { type: Schema.Types.ObjectId, ref: "UserEvent" },
    posts: { type: Schema.Types.ObjectId, ref: "Post" },
    organization: { type: Schema.Types.ObjectId, ref: "Org" },
    isOrganizer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);
