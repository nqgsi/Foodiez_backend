import { model, Schema } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, unique: true, required: true },
  recipes: [{ type: Schema.ObjectId, ref: "Recipe" }],
});

const Category = model("Category", categorySchema);

export default Category;
