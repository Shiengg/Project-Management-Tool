// useSocket.js
"use client";

import { getSocket } from "@/services/socket/socket";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    const id = session?.user._id;
    if (id && !socket) {
      const socketInstance = getSocket(id);
     setSocket(socketInstance);
    }
  }, [session?.user._id]);

  return socket;
};

export default useSocket;
