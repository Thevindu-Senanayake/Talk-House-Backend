import { NextFunction, Request, Response } from "express";
import { IRequest, Message as MessageType } from "../types/types";
import User from "../model/User";
import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import Message from "../model/Message";

export const addMessage = catchAsyncErrors(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { text, reciever: recieverId } = req.body;

    if (!recieverId) {
      return next(new ErrorHandler("Reciever of the message is required", 400));
    }

    if (!text) {
      return next(new ErrorHandler("You cant send empty messages", 400));
    }

    const receiver = await User.findById(recieverId);

    if (!receiver) {
      return next(
        new ErrorHandler("Reciever of the message is not found", 404)
      );
    }

    await Message.create({
      sender: { username: req.user.username, id: req.user._id },
      reciever: recieverId,
    });

    res.send(200).json({ success: true });
  }
);

export const deleteMessage = catchAsyncErrors(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id } = req.body;

    if (!id) {
      return next(new ErrorHandler("Message Id is required", 400));
    }

    const message = await Message.findById(id);

    if (!message) {
      return next(new ErrorHandler(`Message not Found with Id: ${id}`, 404));
    }

    if (message.sender.id.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You can't delete others message", 400));
    }

    await message.delete();

    res.status(200).json({ success: true });
  }
);

export const updateMessage = catchAsyncErrors(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id, text } = req.body;

    if (!id) {
      return next(new ErrorHandler("Message Id is required", 400));
    }

    if (!text || text === "") {
      return next(new ErrorHandler("message can't be empty", 400));
    }

    const message = await Message.findById(id);

    if (!message) {
      return next(new ErrorHandler(`Message not Found with Id: ${id}`, 404));
    }

    if (message.sender.id.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You can't update others message", 400));
    }

    message.text = text;

    await message.save();

    res.status(200).json({ success: true });
  }
);

export const getMessages = catchAsyncErrors(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id: receiverId } = req.body;

    if (!receiverId) {
      return next(new ErrorHandler("receiverId is required", 400));
    }

    const messages = await Message.find({
      $or: [
        { "sender.id": req.user._id, recipient: receiverId },
        { "sender.id": receiverId, recipient: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  }
);
