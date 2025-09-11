import express from "express";
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
} from "../controller/recipe";

const router = express.Router();

router.get("/", getAllRecipes);
router.post("/", createRecipe);
router.delete("/:id", deleteRecipe);

export default router;
