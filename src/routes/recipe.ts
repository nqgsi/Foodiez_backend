import express from "express";
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
} from "../controller/recipe";
import { authorization } from "../API/authorization";
import { upload } from "../Middleware/multer";

const router = express.Router();

router.get("/", getAllRecipes);
router.post("/", authorization, upload.single("image"), createRecipe);
router.delete("/:id", authorization, deleteRecipe);

export default router;
