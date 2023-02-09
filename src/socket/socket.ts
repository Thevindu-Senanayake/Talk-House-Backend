import { Server } from "socket.io";
import { addNewUser, getOnlineUsers, removeUser } from "./connectedUsers";
import { requireSocketAuth } from "../middlewares/socketAuth";
import { Server as httpServer } from "http";

export const createSocketServer = (socket: httpServer) => {
  const io = new Server(socket, {
    cors: {
      credentials: true,
      origin: "http://localhost:5173",
    },
  });

  io.use((socket, next) => {
    requireSocketAuth(socket, next);
  });

  io.on("connection", (socket) => {
    console.log(
      `[+] connection from socketId: ${socket.id} userId: ${socket.data.user._id}`
    );
    addNewUser(socket.id, socket.data.user._id);
    getOnlineUsers();

    socket.on("disconnect", () => {
      removeUser(socket.id);
    });
  });
};
