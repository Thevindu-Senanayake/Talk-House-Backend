import mongoose from "mongoose";
import { Request } from "express";
import { Socket } from "socket.io";

export interface UserModel extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  verified: boolean;
  username: string;
  password: string;
  role: string;
  contacts: mongoose.Schema.Types.ObjectId[];
  groups: mongoose.Schema.Types.ObjectId[];
  updatedAt: Date;
  createdAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
  getJwt: () => string;
}

export interface ContactRequset extends mongoose.Document {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

export interface Message extends mongoose.Document {
  sender: {
    id: mongoose.Schema.Types.ObjectId;
    username: string;
  };
  reciever: mongoose.Schema.Types.ObjectId[];
  text: string;
  createdAt: Date;
  updatedAt?: Date;
}
export interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  username: string;
  email: string;
  role: string;
  contacts: mongoose.Schema.Types.ObjectId[];
  groups: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

export interface JwtPayload {
  id: string;
}

export interface IRequest extends Request {
  user: IUser;
}

interface ServerToClientEvents {
  "friend-invitations": (data: Array<PendingInvitation>) => void;
  "friends-list": (data: Array<Friend>) => void;
  "online-users": (data: Array<OnlineUser>) => void;

  "groupChats-list": (data: Array<GroupChatDetails>) => void;

  "direct-message": (data: {
    newMessage: Message;
    participants: Array<string>;
  }) => void;

  "group-message": (data: { newMessage: Message; groupChatId: string }) => void;

  "direct-chat-history": (data: {
    messages: Array<Message>;
    participants: Array<string>;
  }) => void;

  "group-chat-history": (data: {
    messages: Array<Message>;
    groupChatId: string;
  }) => void;

  "notify-typing": (data: { senderUserId: string; typing: boolean }) => void;

  "call-request": (data: {
    callerName: string;
    audioOnly: boolean;
    callerUserId: string;
    signal: SimplePeer.SignalData;
  }) => void;

  "call-response": (data: {
    otherUserId: string; // the user who is being called (who accepted or rejected the call)
    accepted: boolean;
    signal: SimplePeer.SignalData;
  }) => void;

  "notify-chat-left": () => void;

  "room-create": (data: { roomDetails: ActiveRoom }) => void;

  "active-rooms": (data: { activeRooms: ActiveRoom[] }) => void;

  "active-rooms-initial": (data: { activeRooms: ActiveRoom[] }) => void;

  "conn-prepare": (data: { connUserSocketId: string }) => void;

  "conn-init": (data: { connUserSocketId: string }) => void;

  "conn-signal": (data: {
    connUserSocketId: string;
    signal: SimplePeer.SignalData;
  }) => void;

  "room-participant-left": (data: { connUserSocketId: string }) => void;
}

interface ClientToServerEvents {
  helloFomClient: () => void;

  "direct-message": (data: { message: string; receiverUserId: string }) => void;

  "group-message": (data: { message: string; groupChatId: string }) => void;

  "direct-chat-history": (data: { receiverUserId: string }) => void;

  "group-chat-history": (data: { groupChatId: string }) => void;

  "notify-typing": (data: { receiverUserId: string; typing: boolean }) => void;

  "call-request": (data: {
    receiverUserId: string;
    callerName: string;
    audioOnly: boolean;
    signal: SimplePeer.SignalData;
  }) => void;

  "call-response": (data: {
    receiverUserId: string;
    accepted: boolean;
    signal?: SimplePeer.SignalData;
  }) => void;

  "notify-chat-left": (data: { receiverUserId: string }) => void;

  "room-create": () => void;

  "room-join": (data: { roomId: string }) => void;

  "room-leave": (data: { roomId: string }) => void;

  "conn-signal": (data: {
    signal: SimplePeer.SignalData;
    connUserSocketId: string;
  }) => void;

  "conn-init": (data: { connUserSocketId: string }) => void;
}

interface InterServerEvents {}

interface SocketData {
  user: IUser;
}

export type ISocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents,
  {},
  SocketData
>;

export interface ActiveRoom {
  roomCreator: {
    userId: string;
    socketId: string;
    username: string;
  };
  participants: {
    userId: string;
    socketId: string;
    username: string;
  }[];
  roomId: string;
}
