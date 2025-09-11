import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controller/category";
import { authorization } from "../API/authorization";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", authorization, createCategory);
router.delete("/:id", authorization, deleteCategory);

export default router;
