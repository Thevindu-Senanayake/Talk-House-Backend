import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import sendToken from "../utils/sendToken";
import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import { IRequest } from "../types/types";

export const register = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    // check if user exists
    const userExists = await User.exists({ email: email });

    if (userExists) {
      return next(new ErrorHandler("E-mail is already taken.", 409));
    }

    const user = await User.create({
      email: email,
      username: username,
      password: password,
    });
    sendToken(user._id, 200, res);
  }
);

export const login = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //   Checks if userName and password is entered by user
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email & password", 400));
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      return next(
        new ErrorHandler("Invalid credentials. Please try again", 400)
      );
    }

    const passwordsMatch = user.comparePassword(password);

    if (!passwordsMatch) {
      return next(new ErrorHandler("your password is incorrect", 400));
    }

    sendToken(user._id, 200, res);
  }
);

export const loadUser = catchAsyncErrors(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    res.status(200).json({ success: true, user });
  }
);
