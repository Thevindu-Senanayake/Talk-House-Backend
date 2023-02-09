import ErrorHandler from "../utils/errorHandler";
import User from "../model/User";
import jwt from "jsonwebtoken";
import { ISocket, IUser } from "../types/types";

const config = process.env;

export const requireSocketAuth = async (
  socket: ISocket,
  next: CallableFunction
) => {
  let token = socket.handshake.auth?.token;

  if (!token) {
    return next(
      new ErrorHandler("A token is required for authentication", 401)
    );
  }
  try {
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    socket.data.user = (await User.findById(decode.id as string)) as IUser;
  } catch (err) {
    return next(new ErrorHandler("Please Login !", 403));
  }

  return next();
};
