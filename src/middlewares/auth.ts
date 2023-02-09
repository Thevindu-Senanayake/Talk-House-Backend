import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";
import User from "../model/User";
import { UserModel, IUser, IRequest } from "../types/types";

// Checks if user is authenticated or not
export const isAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const request = req as IRequest;
  const { token } = req.cookies;

  if (!token) {
    res.status(401).send("Login first to access this resource.");
    //  return ("Login first to access this resource.", 401);
  }

  const decode = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as jwt.JwtPayload;
  request.user = (await User.findById(decode.id as string)) as IUser;

  next();
};

// Handle users roles
export const authorizeRoles = (roles: string) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    const authRoles = roles.split(",");
    if (!authRoles.includes(req.user?.role as string)) {
      res
        .status(403)
        .send(
          `Role (${req.user?.role}) is not allowed to access this resource`
        );
    }
    next();
  };
};
