import express from "express";
import {
  createIngredient,
  deleteIngredient,
  getAllingredients,
} from "../controller/ingredients";

const router = express.Router();

router.get("/", getAllingredients);
router.post("/", createIngredient);
router.delete("/:id", deleteIngredient);

export default router;
