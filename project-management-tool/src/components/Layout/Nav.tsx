'use client'
import Image from "next/image";
import React from "react";
import Notification from "../Notification/Notification";
import ProfileIcon from "../UI/ProfileIcon";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { useSession } from "next-auth/react";

export default function Nav({ children }: { children: React.ReactNode }) {
  const {data:session} = useSession()
  return (
    <div className="h-screen w-screen flex flex-col overflow-auto">
      <div className="nav">
        <Link href={`/dashboard`} className="flex flex-row gap-2 items-center">
          <img src={"/AppLogo.png"} alt="app logo" width={24} height={24} />
          <span className="font-semibold">Bello</span>
        </Link>

        <div className="ml-auto flex flex-row gap-4 items-center justify-center">
          <Notification id={session?.user.id || ""} />
          <Link href={`/user`}>
            <ProfileIcon src={session?.user.image || ""} size={32} />
          </Link>
        </div>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
