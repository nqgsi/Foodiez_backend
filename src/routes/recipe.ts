import express from "express";
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
} from "../controller/recipe";
import { authorization } from "../API/authorization";

const router = express.Router();

router.get("/", getAllRecipes);
router.post("/", authorization, createRecipe);
router.delete("/:id", authorization, deleteRecipe);

export default router;
