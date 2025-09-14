import { serverError } from "../Middleware/serverError";
import Category from "../models/Category";
import { NextFunction, Request, Response } from "express";
import Recipe from "../models/Recipe";
import mongoose from "mongoose";
import { invaldCredentialsErrorHandler } from "../Middleware/errors";

const expectedCategoryFields = ["name", "recipes"];

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find().populate("recipes");
    res.status(200).json(categories);
  } catch (error) {
    console.log("Error in getAllCategories:", error);
    return next(serverError);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for invalid fields / typos
    const bodyKeys = Object.keys(req.body || {});
    for (const key of bodyKeys) {
      if (!expectedCategoryFields.includes(key)) {
        return next(
          invaldCredentialsErrorHandler(
            `Invalid field "${key}" in request body. Did you mean one of: ${expectedCategoryFields.join(
              ", "
            )}?`
          )
        );
      }
    }

    const { name, recipes } = req.body;

    // Validate required field
    if (!name) {
      return next(invaldCredentialsErrorHandler("Category name is required"));
    }

    // Check for duplicate name
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(
        invaldCredentialsErrorHandler("Category with this name already exists")
      );
    }

    const category = await Category.create({ name, recipes });

    // If recipes are provided, update their categories
    if (recipes && recipes.length) {
      await Recipe.updateMany(
        { _id: { $in: recipes } },
        { $push: { categories: category._id } }
      );
    }

    return res.status(201).json(category);
  } catch (error) {
    console.log("Error in createCategory:", error);
    next(serverError);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id!)) {
      return next(invaldCredentialsErrorHandler("Invalid category ID"));
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Category not found" });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log("Error in deleteCategory:", error);
    next(serverError);
  }
};
