import { NextFunction, Request, Response } from "express";
import { serverError } from "../Middleware/serverError";
import Recipe from "../models/Recipe";
import Ingredient from "../models/Ingredient";
import Category from "../models/Category";
import User from "../models/User";

export const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipes = await Recipe.find()
      .populate("user", "username")
      .populate("ingredients", "name")
      .populate("categories", "name");
    res.status(200).json(recipes);
  } catch (error) {
    console.log("🚀 ~ getAllRecipes ~ error:", error);
    return next(serverError);
  }
};

export const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, user, ingredients, categories } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title and user are required" });
    }

    const newRecipe = new Recipe({
      title,
      description,
      user,
      ingredients,
      categories,
      image: req.file?.filename,
    });
    const save = await newRecipe.save();

    //ingredients//
    if (save.ingredients.length) {
      await Ingredient.updateMany(
        { _id: { $in: save.ingredients } },
        { $push: { recipes: save._id } }
      );
    }

    // categories//
    if (save.categories.length) {
      await Category.updateMany(
        { _id: { $in: save.categories } },
        { $push: { recipes: save._id } }
      );
    }
    // user//
    await User.findByIdAndUpdate(save.user, {
      $push: { recipes: save._id },
    });
    return res.status(201).json(save);
  } catch (error) {
    console.log("🚀 ~ createRecipe ~ error:", error);
    return next(serverError);
  }
};

export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "recipe not found" });

    return res.status(200).json({ message: "recipe deleted successfully" });
  } catch (error) {
    console.log("🚀 ~ deleteRecipe ~ error:", error);
    next(serverError);
  }
};
