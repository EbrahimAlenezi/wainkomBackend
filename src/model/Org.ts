import { model, Schema, Types } from "mongoose";



const OrgSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    img: String,
    bio: String,
    contacts: String,
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Org = model("Org", OrgSchema);
