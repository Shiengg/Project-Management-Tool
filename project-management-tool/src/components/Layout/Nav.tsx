"use client";
import Image from "next/image";
import React from "react";
import Notification from "../Notification/Notification";
import { useSession } from "next-auth/react";
import ProfileIcon from "../UI/ProfileIcon";

export default function Nav({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="nav">
        <div className="flex flex-row gap-2 items-center">
          <img src={"/AppLogo.png"} alt="app logo" width={24} height={24} />
          <span className="font-semibold">Bello</span>
        </div>

        <div className="ml-auto flex flex-row gap-4 items-center justify-center">
          <Notification />
          <ProfileIcon src={session?.user.image || ""} size={32} />
        </div>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
