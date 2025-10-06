import { model, Schema } from "mongoose";



const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    icon:{type: String ,default:`shape` , required :false}
  },
  { timestamps: true }
);

export const Category = model("Category", CategorySchema);
