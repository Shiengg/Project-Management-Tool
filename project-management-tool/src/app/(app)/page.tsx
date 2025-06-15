"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-black ">Home</h1>
      <h2 className="text-red-500" onClick={()=>signOut()}>Click to sign out</h2>
    </div>
  );
}
