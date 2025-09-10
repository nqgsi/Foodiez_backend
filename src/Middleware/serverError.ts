import { NextFunction, Request, Response } from "express";

export const serverError = (
  next: NextFunction,
  message = "Something went wrong!"
) => {
  next({ status: 500, message: "Something went wrong!" });
};
