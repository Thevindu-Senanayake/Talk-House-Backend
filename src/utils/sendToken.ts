import { Response } from "express";
import mongoose from "mongoose";
import User from "../model/User";
import { UserModel } from "../types/types";

// Create and send token and save in the cookie
const sendToken = async (
  userId: mongoose.Types.ObjectId,
  statusCode: number,
  res: Response
) => {
  const user = await User.findById(userId);

  // Create Jwt
  const token = user?.getJwt();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRES_TIME) * 1000 * 60 * 60 * 24
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

export default sendToken;
