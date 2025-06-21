// useSocket.js
"use client";

import { getSocket } from "@/services/socket/socket";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

const useSocket = (id: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (id) {
      const fetchSocket = async () => {
        const socketInstance: Socket | null = await getSocket(id);
        setSocket(socketInstance);
      };
      fetchSocket();
    }
  }, [id]);

  return socket;
};

export default useSocket;
