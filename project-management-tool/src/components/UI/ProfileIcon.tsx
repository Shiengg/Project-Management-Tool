import React from "react";
import Image from "next/image";
import { type User as UserType } from "@/lib/types";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { User } from "lucide-react";
import { getColorFromNumber, getColorFromPercentage } from "@/lib/render";

export default function ProfileIcon({
  src,
  size,
}: {
  src: UserType | undefined;
  size: number;
}) {
  if (!src) {
    return (
      <div
        className="rounded-full size-9 flex items-center justify-center bg-black cursor-pointer"
        style={{ width: size, height: size }}
      >
        <User />
      </div>
    );
  }
  return (
    <Avatar
      className="h-10 w-10 ring-2 ring-blue-100"
      style={{ width: size, height: size }}
    >
      <AvatarImage src={src.image || ""} alt="Profile" />
      <AvatarFallback
        className=" text-white font-semibold text-shadow-2xs"
        style={{
          fontSize: size * 0.6,
          backgroundColor: getColorFromNumber(
            new Date(src.createdAt).getTime()
          ),
        }}
      >
        {src.username?.charAt(0)?.toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  );
}
