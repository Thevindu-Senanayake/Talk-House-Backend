import mongoose from "mongoose";
import { ContactRequest } from "../types/types";

const ContactRequestSchema = new mongoose.Schema(
  {
    // User sending the invitation
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender Id is required"],
    },

    // User who is being invited
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver Id is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);

export default mongoose.model<ContactRequest>(
  "ContactRequest",
  ContactRequestSchema
);
