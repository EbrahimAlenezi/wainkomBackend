import { Schema, model, Document, Types } from "mongoose";



const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, enum: ["user", "admin","org"], default: "user" },
    isAdmin: { type: Boolean, default: false },
    orgId: { type: Schema.Types.ObjectId, ref: "Org" },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
