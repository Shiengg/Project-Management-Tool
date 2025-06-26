import { NOTIFICATION_CHANNEL } from "@/constant/socketChannel";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentUserId: string | null = null;

export const getSocket = (id: string): Socket => {
  if (socket && socket.connected && currentUserId === id) return socket;

  if (!socket || !socket.connected) {
    socket = io(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}`, {
      timeout: 5000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
      socket?.emit(NOTIFICATION_CHANNEL.JOIN, id);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("Connection Error:", err.message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("reconnect", () => {
      console.log("Socket reconnected");
      socket?.emit(NOTIFICATION_CHANNEL.JOIN, id);
    });
  } else if (currentUserId !== id) {
    socket.emit(NOTIFICATION_CHANNEL.JOIN, id);
  }

  currentUserId = id;

  return socket;
};
