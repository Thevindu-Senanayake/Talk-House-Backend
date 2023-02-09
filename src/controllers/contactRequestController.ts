import { NextFunction, Request, Response } from "express";
import { IRequest } from "../types/types";
import ContactRequset from "../model/ContactRequset";
import User from "../model/User";
import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";

export const requestContact = catchAsyncErrors(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { email: senderEmail, _id: senderId } = req.user;
    const { email: receiverEmail } = req.body;

    // check if email. is present in req.body
    if (!receiverEmail) {
      return next(new ErrorHandler("Receiver's email must specified", 400));
    }

    // check if user is sending request to himself
    if (senderEmail === receiverEmail) {
      return next(
        new ErrorHandler("You can't send contact request to yourself", 400)
      );
    }

    // check if the receiver exists in the database
    const receiver = await User.findOne({ email: receiverEmail });

    if (!receiver) {
      return next(
        new ErrorHandler(`User not found with email: ${receiverEmail}`, 404)
      );
    }

    // check if request has already been sent
    const requsetAlreadyExists = await ContactRequset.findOne({
      senderId: senderId,
      receiverId: receiver._id,
    });

    if (requsetAlreadyExists) {
      return next(
        new ErrorHandler(
          "You have already sent an invitation to this user",
          409
        )
      );
    }

    // check if user is already in contacts
    const inSendersContact = req.user.contacts.some((contact) => {
      return contact.toString() == receiver?._id.toString();
    });
    const inReceiversContact = receiver?.contacts.some((contact) => {
      return contact.toString() == req.user._id.toString();
    });

    if (inSendersContact && inReceiversContact) {
      return next(
        new ErrorHandler(
          `User: ${receiver.username} is already in contacts.`,
          409
        )
      );
    } else if (inSendersContact && !inReceiversContact) {
      // ID: receiver._id
      await User.updateOne(
        { _id: req.user._id },
        { $pull: { contacts: receiver._id } }
      );
    } else if (!inSendersContact && inReceiversContact) {
      // ID: req.user._id
      await User.updateOne(
        { _id: receiver._id },
        { $pull: { contacts: req.user._id } }
      );
    }

    // create invitation
    await ContactRequset.create({
      senderId: senderId,
      receiverId: receiver._id,
    });

    // after successfully creating the invitation, update the target user's pending invitation list
    // with the new invitation in real time using sockets if the target user is online
    // TODO: update sockets

    return res.status(200).json({ success: true });
  }
);

export const acceptRequset = catchAsyncErrors(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { email: senderEmail } = req.body;

    if (!senderEmail) {
      return next(new ErrorHandler("Request sender's Email is required", 400));
    }

    const sender = await User.findOne({ email: senderEmail });

    if (!sender) {
      // await ContactRequset.findOneAndDelete({})
      return next(new ErrorHandler("Sender of this request not found", 404));
    }

    if (sender._id.toString() == req.user._id.toString()) {
      return next(
        new ErrorHandler("You cannot accept Your Own Invitations", 400)
      );
    }

    const request = await ContactRequset.findOne({
      senderId: sender._id,
      receiverId: req.user._id,
    });

    if (!request) {
      return next(
        new ErrorHandler(`No request found from Email: ${senderEmail}`, 404)
      );
    }

    const receiver = await User.findById(request.receiverId);

    receiver?.contacts.push(request.senderId);
    sender?.contacts.push(request.receiverId);

    await receiver?.save();
    await sender?.save();

    await ContactRequset.findByIdAndDelete(request._id);

    // TODO: notify sockets

    res.status(200).json({ success: true });
  }
);

export const declineRequest = catchAsyncErrors(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id } = req.body;

    if (!id) {
      return next(new ErrorHandler("Sender's id is required", 400));
    }

    if (id == req.user._id) {
      return next(
        new ErrorHandler("You cannot decline Your Own Invitations", 400)
      );
    }

    const request = await ContactRequset.findOne({
      senderId: id,
      receiverId: req.user._id,
    });

    if (!request) {
      return next(new ErrorHandler(`No request found from User: ${id}`, 404));
    }

    await ContactRequset.findByIdAndDelete(request._id);

    // TODO: notify sockets

    res.status(200).json({ success: true });
  }
);

export const cancelRequest = catchAsyncErrors(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id: requestId } = req.body;

    if (!requestId) {
      return next(new ErrorHandler("request id is required", 400));
    }

    const request = await ContactRequset.findById(requestId);

    if (!request) {
      return next(
        new ErrorHandler(`No request found with Id: ${requestId}`, 404)
      );
    }

    await ContactRequset.findByIdAndDelete(request._id);

    res.status(200).json({ success: true });
  }
);

export const deleteContact = catchAsyncErrors(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorHandler("Email is not specified", 400));
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const inSendersContact = req.user.contacts.some((contact) => {
      return contact.toString() == user?._id.toString();
    });
    const inReceiversContact = user?.contacts.some((contact) => {
      return contact.toString() == req.user._id.toString();
    });

    const successContact = inSendersContact && inReceiversContact;

    if (successContact) {
      await User.updateOne(
        { _id: user?._id },
        { $pull: { contacts: req.user._id } }
      );
      await User.updateOne(
        { _id: req.user._id },
        { $pull: { contacts: user?._id } }
      );
    }

    res.status(200).json({ success: true });
  }
);
