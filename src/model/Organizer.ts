import { model, Schema, Types } from "mongoose";



const OrgSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    address: { type: String },
    image: { type: String, required: true},
    bio: { type: String },
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    phone: { type: String, required: true},
    website: { type: String },
  },
  { timestamps: true }
);  

export const Org = model("Org", OrgSchema);
