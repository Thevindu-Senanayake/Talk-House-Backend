import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../types/types";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter your email."],
      maxLength: [40, "Your email cannot be longer than 40 characters."],
    },
    username: {
      type: String,
      required: [true, "Please enter your name."],
      maxLength: [30, "Your name cannot be longer than 30 characters."],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Your password has to be longer than 6 characters."],
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
  },
  {
    versionKey: false,
  }
);

// Encrypting password before saving user
userSchema.pre("save", async function (next) {
  // return to next middleware if password is not modified
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return JSON Web Token
userSchema.methods.getJwt = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

export default mongoose.model<UserModel>("User", userSchema);
