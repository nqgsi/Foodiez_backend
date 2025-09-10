import { NextFunction } from "express";

export const invaldCredentialsErrorHandler = (
  message = "Invalid Credentials!🙅🏽‍♀️"
) => {
  return { status: 401, message };
};
