"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import ProfileIcon from "../UI/ProfileIcon";
import { toastRequest } from "../toast/toaster";
import { Routes } from "@/constant/accountRoutes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const { data: session } = useSession();
  const pathName = usePathname();

  const handleSignOut = async () => {
    const result = await toastRequest("Sign out?");
    if (result) {
      signOut();
    }
  };
  return (
    <div className="SideBar ">
      <div className="bg-black hidden lg:flex flex-row gap-2 p-2 items-center min-w-fit">
        <ProfileIcon src={session?.user.image || ""} size={32} />

        <span className="flex flex-col gap-1 items-start justify-around w-fit">
          <span>{session?.user.username}</span>
          <span className="italic text-xs opacity-70">{session?.user.email}</span>
        </span>
      </div>
      <ul
        className="grow flex flex-row lg:flex-col overflow-auto "
        style={{
          backgroundColor: "rgba(39, 39, 39, 0.7)",
        }}
      >
        {Routes.map((r) => (
          <Link
            key={r.path}
            href={r.path}
            className={`${
              r.path === pathName
                ? "font-semibold bg-white/20"
                : " hover:bg-white/20 active:bg-white/30"
            } p-2 flex items-center whitespace-nowrap grow`}
          >
            {r.name}
          </Link>
        ))}
        <button
         
          onClick={handleSignOut}
          className="bg-red-500/70 p-2 font-semibold hover:bg-red-500/90 active:bg-red-500 whitespace-nowrap mt-auto"
        >
          Sign out
        </button>
      </ul>
    </div>
  );
}
