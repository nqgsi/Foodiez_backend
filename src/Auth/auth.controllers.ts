import { NextFunction, Request, Response } from "express";
import { generateHashPassword } from "../Utils/hashPassword";
import { generatetoken } from "../Utils/jwt";
import { serverError } from "../Middleware/serverError";
import validator from "validator";
import bcrypt from "bcrypt";
import User from "../models/User";
import { invaldCredentialsErrorHandler } from "../Middleware/errors";
import { env } from "process";

const expectedFields = ["email", "username", "password"];

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username } = req.body || {};

    // Check for typos in field names
    const bodyKeys = Object.keys(req.body || {});
    bodyKeys.forEach((key) => {
      if (!expectedFields.includes(key)) {
        return next(
          invaldCredentialsErrorHandler(
            `Invalid field "${key}" in request body. Did you mean one of: ${expectedFields.join(
              ", "
            )}?`
          )
        );
      }
    });

    if (!email || !password || !username) {
      return next(
        invaldCredentialsErrorHandler(
          "Email, username, and password are required"
        )
      );
    }

    if (!validator.isEmail(email)) {
      return next(invaldCredentialsErrorHandler("Invalid email format"));
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next({ message: "Email already exists!", status: 400 });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return next({ message: "Username already exists!", status: 400 });
    }

    const hashedPassword = await generateHashPassword(password);
    const PORT = env.PORT;

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      image: req.file?.filename,
    });

    if (req.file) {
      newUser.image = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    }

    const token = generatetoken(newUser, email);
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.log("Signup error:", err);
    return next(serverError);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const expectedFields = ["email", "password"];

    const bodyKeys = Object.keys(req.body || {});
    for (const key of bodyKeys) {
      if (!expectedFields.includes(key)) {
        return next(
          invaldCredentialsErrorHandler(
            `Invalid field "${key}" in request body. Did you mean one of: ${expectedFields.join(
              ", "
            )}?`
          )
        );
      }
    }

    const { email, password } = req.body;

    // Check for missing required fields
    if (!email || !password) {
      return next(
        invaldCredentialsErrorHandler("Email and password are required")
      );
    }

    if (!validator.isEmail(email)) {
      return next(invaldCredentialsErrorHandler("Invalid email format"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(invaldCredentialsErrorHandler("Email not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return next(invaldCredentialsErrorHandler());
    }

    const token = generatetoken(user._id, email);
    res.status(200).json({ token });
  } catch (err) {
    console.log("Signin error:", err);
    return next(serverError);
  }
};
