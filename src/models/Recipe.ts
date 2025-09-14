import { model, Schema } from "mongoose";

const recipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  user: { type: Schema.ObjectId, ref: "User" },
  ingredients: [{ type: Schema.ObjectId, ref: "Ingredient" }],
  categories: [{ type: Schema.ObjectId, ref: "Category" }],
  image: { type: String },
});

const Recipe = model("Recipe", recipeSchema);

export default Recipe;
