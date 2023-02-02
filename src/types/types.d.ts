import mongoose from "mongoose";
import { Request } from "express";

export interface UserModel extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  role: string;
  contacts: mongoose.Schema.Types.ObjectId;
  groups: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
  getJwt: () => string;
}

export interface IUser {
  username: string;
  email: string;
  role: string;
}

export interface JwtPayload {
  id: string;
}

export interface IRequest extends Request {
  user?: IUser;
}
