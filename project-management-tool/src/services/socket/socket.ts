import { NOTIFICATION_CHANNEL } from "@/constant/socketChannel";
import { io } from "socket.io-client";

let socket: any = null;

export const getSocket = (id: string) => {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}`);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit(NOTIFICATION_CHANNEL.JOIN, id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("reconnect", () => {
      console.log("Socket reconnected");
      socket.emit(NOTIFICATION_CHANNEL.JOIN, id);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("Connection Error:", err);
    });
  }

  return socket;
};
