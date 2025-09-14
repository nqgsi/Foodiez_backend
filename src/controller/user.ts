import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { serverError } from "../Middleware/serverError";
import mongoose from "mongoose";
import { invaldCredentialsErrorHandler } from "../Middleware/errors";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate({
        path: "recipes",
        select: "title description",
        populate: [
          { path: "ingredients", select: "name" },
          { path: "categories", select: "name" },
          { path: "user", select: "username" },
        ],
      });

    return res.status(200).json(users);
  } catch (error) {
    console.log("🚀 ~ getAllUsers ~ error:", error);
    return next(serverError);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id!)) {
      return next(invaldCredentialsErrorHandler("Invalid user ID"));
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "user not found" });

    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    console.log("🚀 ~ deleteUser ~ error:", error);
    next(serverError);
  }
};
