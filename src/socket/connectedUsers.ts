import { Server } from "socket.io";

const connectedUsers = new Map<string, string>();
let io: Server | null = null;

export const addNewUser = (socketId: string, userId: string) => {
  connectedUsers.set(socketId, userId);
};

export const removeUser = (socketId: string) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
  }
  console.log(`User removed ${socketId}`);
};

// get active connections of a particular user
export const getActiveConnections = (userId: string) => {
  // get user's socket ids(active socket connections)
  const activeConnections: string[] = [];

  connectedUsers.forEach((value, key) => {
    if (value === userId) {
      activeConnections.push(key);
    }
  });

  return activeConnections;
};

export const getOnlineUsers = () => {
  const onlineUsers: { [key: string]: string }[] = [];

  connectedUsers.forEach((value, key) => {
    onlineUsers.push({
      [key]: value,
    });
  });

  for (let i = 0; i < onlineUsers.length; i++) {
    console.log(`Connected Users: ${JSON.stringify(onlineUsers[i])}`);
  }

  return onlineUsers;
};

export const setServerSocketInstance = (ioInstance: Server) => {
  io = ioInstance;
};

export const getServerSocketInstance = () => {
  return io;
};
