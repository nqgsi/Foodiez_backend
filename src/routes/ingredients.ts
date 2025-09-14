import express from "express";
import {
  createIngredient,
  deleteIngredient,
  getAllIngredients,
} from "../controller/ingredients";
import { authorization } from "../API/authorization";

const router = express.Router();

router.get("/", getAllIngredients);
router.post("/", authorization, createIngredient);
router.delete("/:id", authorization, deleteIngredient);

export default router;
