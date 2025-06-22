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
import { type Notification } from "@/lib/types";
import NotificationItem from "./NotifiationItem/NotifcationItem";
import { getNotification } from "@/services/notificationService";
import { toastNotification } from "../toast/toaster";

export default function Notification({ id }: { id: string }) {
  const socket = useSocket();
  const [notification, setNotification] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (id: string, state: boolean) => {
    setNotification((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotify = (notification: Notification) => {
    setNotification((prev) => [notification, ...prev]);
    toastNotification(notification);
  };

  const textNotify = async () => {
    if (socket) {
      socket.emit(PROJECT_CHANNEL.ADD_MEMBER, {
        userIds: [id],
        id: "id" + Math.random() * 123,
        projectId: "123",
        projectName: "TEST",
        email: "test@gmail.com",
        createdAt: new Date(),
      });
    }
  };

  const fetchNotification = async () => {
    if (id) {
      setIsLoading(true);
      getNotification(id).then((res) => {
        setNotification((prev) => [...prev, ...res]);
        setTimeout(() => setIsLoading(false), 500);
      });
    }
  };

  useEffect(() => {
    fetchNotification();
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    socket.on(PROJECT_CHANNEL.ADD_MEMBER, handleNotify);

    return () => {
      socket.off(PROJECT_CHANNEL.ADD_MEMBER, handleNotify);
    };
  }, [socket]);

  return (
    <Menu
      name="Notification"
      icon={
        notification.length ? (
          <div
            className="flex flex-row p-1 bg-white rounded gap-1 text-gray-600 items-center"
            onClick={textNotify}
          >
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
        <ul className="flex flex-col p-1 gap-1 w-[300px]">
          {notification
            ?.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                handleAction={handleAction}
              />
            ))}
        </ul>
      }
    />
  );
}
