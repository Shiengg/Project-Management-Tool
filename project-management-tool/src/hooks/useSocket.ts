// useSocket.js
"use client";

import { getSocket } from "@/services/socket/socket";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const id = session?.user.id;
    if (id) {
      const fetchSocket = async () => {
        const socketInstance: Socket | null = await getSocket(id);
        setSocket(socketInstance);
      };
      fetchSocket();
    }
  }, [session?.user.id]);

  return socket;
};

export default useSocket;
