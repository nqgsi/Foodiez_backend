import express from "express";
import {
  createIngredient,
  deleteIngredient,
  getAllingredients,
} from "../controller/ingredients";
import { authorization } from "../API/authorization";

const router = express.Router();

router.get("/", getAllingredients);
router.post("/", authorization, createIngredient);
router.delete("/:id", authorization, deleteIngredient);

export default router;
