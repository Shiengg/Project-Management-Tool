// useSocket.js
"use client";

import { getSocket } from "@/services/socket/socket";
import { useState, useEffect } from "react";

const useSocket = (id: string): any => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (id) {
      const socketInstance = getSocket(id);
      setSocket(socketInstance);
    }
  }, [id]);

  return socket;
};

export default useSocket;
