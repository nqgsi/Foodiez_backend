import { serverError } from "../Middleware/serverError";
import { NextFunction, Request, Response } from "express";
import Ingredient from "../models/Ingredient";
import Recipe from "../models/Recipe";
import mongoose from "mongoose";
import { invaldCredentialsErrorHandler } from "../Middleware/errors";

const expectedIngredientFields = ["name", "recipes"];

export const getAllIngredients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ingredients = await Ingredient.find().populate("recipes");
    res.status(200).json(ingredients);
  } catch (error) {
    console.log("the error from getAllIngredients", error);
    return next(serverError);
  }
};

export const createIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bodyKeys = Object.keys(req.body || {});
    for (const key of bodyKeys) {
      if (!expectedIngredientFields.includes(key)) {
        return next(
          invaldCredentialsErrorHandler(
            `Invalid field "${key}" in request body. Did you mean one of: ${expectedIngredientFields.join(
              ", "
            )}?`
          )
        );
      }
    }

    if (!req.body.name) {
      return next(invaldCredentialsErrorHandler("Ingredient name is required"));
    }

    const existingIngredient = await Ingredient.findOne({
      name: req.body.name,
    });
    if (existingIngredient) {
      return next(
        invaldCredentialsErrorHandler(
          "Ingredient with this name already exists"
        )
      );
    }

    const ingredient = await Ingredient.create(req.body);
    const save = await ingredient.save();
    if (save.recipes.length) {
      await Recipe.updateMany(
        { _id: { $in: save.recipes } },
        { $push: { ingredients: save._id } }
      );
    }
    return res.status(200).json(ingredient);
  } catch (error) {
    console.log("🚀 ~ createIngredient ~ error:", error);
    next(serverError);
  }
};

export const deleteIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id!)) {
      return next(invaldCredentialsErrorHandler("Invalid ingredient ID"));
    }

    const deleted = await Ingredient.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "ingredient not found" });

    return res.status(200).json({ message: "ingredient deleted successfully" });
  } catch (error) {
    console.log("🚀 ~ deleteIngredient ~ error:", error);
    next(serverError);
  }
};
