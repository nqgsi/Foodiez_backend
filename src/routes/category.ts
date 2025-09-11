import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controller/category";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);

export default router;
