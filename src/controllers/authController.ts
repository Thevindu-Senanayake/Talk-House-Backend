import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import OTP from "../model/OTP";
import sendToken from "../utils/sendToken";
import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import { IRequest } from "../types/types";
import generateOTP from "../utils/generateOTP";
import { sendConfirmationEmail } from "../utils/sendEmails";
import { generateUsername } from "../utils/generateUsername";

export const register = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, phoneNumber } = req.body;

    if (!name) {
      return next(new ErrorHandler("Your Name is not specified", 400));
    }
    if (email) {
      //  check if user is already registered with this email and if so return error message
      const user = await User.findOne({ email: email });

      if (user?.verified) {
        return next(
          new ErrorHandler(`User Already Exists with this Email ${email}`, 400)
        );
      }

      if (!user?.verified) {
        res.cookie("registrationCompleted", true);
        res.cookie("email", email);

        res.redirect("/api/v2/auth/resendOTP");
      }

      // generate otp
      const otp = await generateOTP();

      // send confirmation email
      await sendConfirmationEmail(email, otp);

      await OTP.create({ code: otp, email: email });
      await User.create({
        email: email,
        password: password,
        name: name,
        username: generateUsername(name),
      });

      res.cookie("registrationCompleted", true);
      res.cookie("email", email);

      res.status(200).json({
        success: true,
        message: "A confirmation Email has been sent to your email",
      });
    }
  }
);

export const verifyRegistration = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;
    const { email } = req.cookies;

    if (!code) {
      return next(new ErrorHandler("Code is required", 400));
    }

    if (!email) {
      return next(new ErrorHandler("Can't retrieve email from cookies", 500));
    }

    const otp = await OTP.findOne({ email: email });

    if (!otp) {
      return next(new ErrorHandler("Otp not found", 404));
    }

    if (otp.code !== code) {
      return next(new ErrorHandler("Invalid Code", 400));
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return next(new ErrorHandler(`User not found with Email ${email}`, 404));
    }

    user.verified = true;

    await user.save();

    res.clearCookie("email", { path: "/" });
    res.clearCookie("registrationCompleted", { path: "/" });

    sendToken(user._id, 200, res);
  }
);

export const resendOTP = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.cookies;

    if (!email) {
      return next(new ErrorHandler("Can't retrieve email from cookies", 500));
    }

    // generate otp
    const otp = await generateOTP();

    // send confirmation email
    await sendConfirmationEmail(email, otp);

    // check if otp is already present and if delete the current otp record
    await OTP.findOneAndDelete({ email: email });

    await OTP.create({ code: otp, email: email });

    res.status(200).json({
      success: true,
      message: "A confirmation Email has been sent to your email",
    });
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
      return next(new ErrorHandler(`User Not Found with Email: ${email}`, 400));
    }

    if (!user.verified) {
      return next(
        new ErrorHandler(
          "Verification Your Account Using OTP And try again",
          401
        )
      );
    }

    const passwordsMatch = user.comparePassword(password);

    if (!passwordsMatch) {
      return next(new ErrorHandler("your password is incorrect", 400));
    }

    sendToken(user._id, 200, res);
  }
);

export const logout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "You have logged out",
    });
  }
);

export const loadUser = catchAsyncErrors(
  async (req: IRequest, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true, user: req.user });
  }
);

export const getContacts = catchAsyncErrors(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { contacts } = req.user;

    if (!contacts) {
      return next(new ErrorHandler("You don't Have Any Contacts", 400));
    }

    const response: Array<{
      name: string;
      email: string;
      username: string;
      _id: string;
    }> = [];

    contacts.forEach(async (id) => {
      const contact = await User.findById(id);
      // response.push(contact);
    });

    res.status(200).json(response);
  }
);
