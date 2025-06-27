"use client";
import Image from "next/image";
import React, { createContext } from "react";
import Notification from "../Invitation/Invitation";
import ProfileIcon from "../UI/ProfileIcon";
import Link from "next/link";
import { useSession } from "next-auth/react";
import useSocket from "@/hooks/useSocket";
import { Socket } from "socket.io-client";

export const socketContext = createContext<Socket | null>(null);

export default function Nav({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const socket = useSocket();

  return (
    <socketContext.Provider value={socket}>
      <div className="h-screen w-screen flex flex-col overflow-auto">
        <div className="nav fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-50">
          <Link href={`/dashboard`} className="flex flex-row gap-2 items-center">
            <img src={"/AppLogo.png"} alt="app logo" width={24} height={24} />
            <span className="font-semibold">Bello</span>
          </Link>

          <div className="ml-auto flex flex-row gap-4 items-center justify-center">
            <Notification id={session?.user._id || ""} />
            <Link href={`/user`}>
              <ProfileIcon src={session?.user.image || ""} size={32} />
            </Link>
          </div>
        </div>

        <div className="flex-1">
          {children}
        </div>
      </div>
    </socketContext.Provider>
  );
}
