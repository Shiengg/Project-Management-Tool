"use client";
import React, { useEffect, useState } from "react";
import { Bell, Divide, Mail } from "lucide-react";
import useSocket from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import Menu from "../UI/Menu";
import {
  NOTIFICATION_CHANNEL,
  PROJECT_CHANNEL,
} from "@/constant/socketChannel";

export default function Notification() {
  const { data: session } = useSession();
  const socket = useSocket(session?.user.id || "");
  const [notification, setNotification] = useState<
    {
      projectId: string;
      projectName: string;
      email: string;
      createdAt: Date | string;
    }[]
  >([]);

  const handleAccept = (projectId: string, email: string) => {
    setNotification((prev) =>
      prev.filter((n) => n.projectId !== projectId && n.email !== email)
    );
  };

  const handleNotify = ({
    projectId,
    projectName,
    email,
  }: {
    projectId: string;
    projectName: string;
    email: string;
  }) => {
    setNotification((prev) => [
      {
        projectId,
        projectName,
        email,
        createdAt: new Date(),
      },
      ...prev,
    ]);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(PROJECT_CHANNEL.ADD_MEMBER, handleNotify);

    return () => {
      socket.off(PROJECT_CHANNEL.ADD_MEMBER, handleNotify);
    };
  }, [socket]);
  return (
    <Menu
      name="Invitations"
      icon={
        notification.length ? (
          <div className="flex flex-row p-1 bg-white rounded gap-1 text-gray-600 items-center">
            <span className="px-2 font-semibold text-sm">
              {notification.length}
            </span>
            <Bell />
          </div>
        ) : (
          <Bell />
        )
      }
      menu={
        <ul className="flex flex-col">
          {notification
            ?.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((n) => (
              <li key={n.createdAt.toString()}>
                {n.email}{" "}
                <button onClick={() => handleAccept(n.projectId, n.email)}>
                  accept
                </button>
              </li>
            ))}
        </ul>
      }
    />
  );
}
