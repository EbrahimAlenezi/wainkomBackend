import { Schema, model, Types, HydratedDocument, InferSchemaType } from "mongoose";


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

export type UserAttrs = InferSchemaType<typeof UserSchema>;
export type UserDoc = HydratedDocument<UserAttrs>
export const User = model<UserDoc>("User", UserSchema);
