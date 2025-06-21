import { NOTIFICATION_CHANNEL } from "@/constant/socketChannel";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (id: string): Promise<Socket | null> => {
  return new Promise((resolve, reject) => {
    if (socket && socket.connected) {
      return resolve(socket);
    }

    socket = io(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}`, {
      timeout: 5000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
      socket?.emit(NOTIFICATION_CHANNEL.JOIN, id);
      resolve(socket as Socket);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("Connection Error:", err.message);
      reject(err);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("reconnect", () => {
      console.log("Socket reconnected");
      socket?.emit(NOTIFICATION_CHANNEL.JOIN, id);
    });
  });
};
