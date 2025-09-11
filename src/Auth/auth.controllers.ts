import { NextFunction, Request, Response } from "express";
import { generateHashPassword } from "../Utils/hashPassword";
import { generatetoken } from "../Utils/jwt";
import { serverError } from "../Middleware/serverError";
import validator from "validator";
import bcrypt from "bcrypt";
import User from "../models/User";
import { invaldCredentialsErrorHandler } from "../Middleware/errors";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username } = req.body || {};
    if (!email || !password || !username) {
      return next(
        invaldCredentialsErrorHandler(
          "Email and username and password are required"
        )
      );
    }

    if (!validator.isEmail(email)) {
      return next(invaldCredentialsErrorHandler("Invalid email format"));
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next({ message: "email already exists!", status: 400 });
    }
    const userExists = await User.findOne({ username });
    if (userExists) {
      return next({ message: "username already exists!", status: 400 });
    }
    const hashedPassword = await generateHashPassword(password);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    const token = generatetoken(newUser, email);
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.log("this is the error", err);
    return next(serverError);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        invaldCredentialsErrorHandler("Email and password are required")
      );
    }

    const emailFound = await User.findOne({ email });
    if (!emailFound) {
      return next(invaldCredentialsErrorHandler());
    }
    const isMatch = await bcrypt.compare(password, emailFound.password!);
    if (!isMatch) {
      return next(invaldCredentialsErrorHandler());
    }
    const token = generatetoken(emailFound._id, email);

    res.status(200).json({ token });
  } catch (err) {
    return next(serverError);
  }
};
