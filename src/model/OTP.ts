import { Schema, model } from "mongoose";

const OTPSchema = new Schema({
  phoneNumber: {
    type: String,
    minLength: [7, "Phone number must be at least 7 characters long"],
    maxLength: [15, "Phone number can't be long than 15 characters"],
    sparse: true,
  },
  email: {
    type: String,
    unique: true,
    maxLength: [40, "Your email cannot be longer than 40 characters."],
    sparse: true,
  },
  code: {
    type: String,
    required: [true, "OTP is required"],
    maxLength: [6, "OTP can't be longer than 6 characters"],
  },
  createdAt: { type: Date, default: Date.now, index: { expires: 300 } },
});

export default model("OTP", OTPSchema);
