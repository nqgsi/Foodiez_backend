import { model, Schema } from "mongoose";

const ingredientSchema = new Schema({
  name: { type: String, unique: true, required: true },
  recipes: [{ type: Schema.ObjectId, ref: "Recipe" }],
});

const Ingredient = model("Ingredient", ingredientSchema);

export default Ingredient;
