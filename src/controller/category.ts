import { serverError } from "../Middleware/serverError";
import Category from "../models/Category";
import { NextFunction, Request, Response } from "express";
import Recipe from "../models/Recipe";

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find().populate("recipes");
    res.status(200).json(categories);
  } catch (error) {
    console.log("the error from getAllCategories", error);
    return next(serverError);
  }
};
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.create(req.body);
    const save = await category.save();
    if (save.recipes.length) {
      await Recipe.updateMany(
        { _id: { $in: save.recipes } },
        { $push: { categories: save._id } }
      );
    }

    return res.status(200).json(category);
  } catch (error) {
    console.log("🚀 ~ createCategory ~ error:", error);
    next(serverError);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "category not found" });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log("🚀 ~ deleteCategory ~ error:", error);
    next(serverError);
  }
};
