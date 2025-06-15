import React from "react";
import { User } from "lucide-react";
import Image from "next/image";

export default function ProfileIcon({
  src,
  size,
}: {
  src: string;
  size: number;
}) {
  return (
    <div
      className="rounded-full size-9 flex items-center justify-center bg-black cursor-pointer"
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          width={100}
          height={100}
          alt="profile"
          quality={10}
          className="rounded-full size-full object-cover"
        ></Image>
      ) : (
        <User />
      )}
    </div>
  );
}
