import mongoose from "mongoose";
import { Message } from "../types/types";

const MessageSchema = new mongoose.Schema(
  {
    // User sending the message
    sender: {
      username: {
        type: String,
        required: [true, "Senders username is required"],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender Id is required"],
      },
    },
    receiver: { type: mongoose.Schema.Types.ObjectId },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  },
  { versionKey: false }
);

export default mongoose.model<Message>("Message", MessageSchema);
