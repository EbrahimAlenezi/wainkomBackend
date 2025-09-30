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

interface UserDoc extends Document {
  username: string;
  email: string;
  password: string;
  image: string;
  bio: string;
  phone: string;
  engagements: Types.ObjectId;
  posts: Types.ObjectId;
  organization: Types.ObjectId;
  isOrganizer: boolean;
}

export const User = model<UserDoc>("User", UserSchema);
