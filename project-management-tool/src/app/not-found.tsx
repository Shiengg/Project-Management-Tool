"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="panel-1 flex items-center justify-center h-screen text-center">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/AppLogo.png"
          alt="Not Found"
          width={100}
          height={100}
          className="mb-4"
        />
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-lg italic">
          The page you are looking for does not exist.
        </p>
        <button className="mt-4 underline" onClick={() => router.back()}>
          Go back
        </button>
      </div>
    </div>
  );
}
