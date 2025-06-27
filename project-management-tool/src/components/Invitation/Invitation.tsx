"use client";
import React, { useContext, useEffect, useState } from "react";
import { Bell, Divide, Mail } from "lucide-react";
import useSocket from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import Menu from "../UI/Menu";
import {
  NOTIFICATION_CHANNEL,
  PROJECT_CHANNEL,
} from "@/constant/socketChannel";
import { type Invitation } from "@/lib/types";
import NotificationItem from "./InvitationItem/InvitationItem";
import {
  getNotification,
  handleNotification,
} from "@/services/notificationService";
import { toastNotification, toastSuccess } from "../toast/toaster";
import { socketContext } from "../Layout/Nav";
import { Socket } from "socket.io-client";

export default function Invitation({ id }: { id: string }) {
  const socket = useContext(socketContext);
  const { data: session } = useSession();
  const [invitation, setInvitation] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (invitation: Invitation, state: boolean) => {
    if (!session?.user) return;
    setInvitation((prev) => prev.filter((n) => n._id !== invitation._id));
    handleNotification(id, invitation._id, state).then((data) => {
      toastSuccess(data.message);
      if (state) {
        window.location.href = `/project/${invitation.projectId}`;
        if (socket) {
          socket.emit(PROJECT_CHANNEL.JOIN_PROJECT, {
            projectId: invitation.projectId,
            user: session?.user,
          });

          socket.emit(PROJECT_CHANNEL.LOG, {
            projectId: invitation.projectId,
            log: data.log,
          });
        }
      }
    });
  };

  const handleNotify = (invitation: Invitation) => {
    setInvitation((prev) => {
      // Filter out existing notification with same _id
      const filtered = prev.filter((n) => n._id !== invitation._id);
      // Add the new one to the top
      return [invitation, ...filtered];
    });

    toastNotification(invitation);
  };

  const fetchNotification = async () => {
    if (id) {
      setIsLoading(true);
      getNotification(id).then((res) => {
        const notifications = Array.isArray(res) ? res : [];
        setInvitation((prev) => [...prev, ...notifications]);
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
      name="Invitation"
      icon={
        invitation.length ? (
          <div className="flex flex-row p-1 bg-white rounded gap-1 text-gray-600 items-center">
            <span className="px-2 font-semibold text-sm">
              {invitation.length}
            </span>
            <Bell />
          </div>
        ) : (
          <Bell />
        )
      }
      menu={
        <ul className="flex flex-col p-1 gap-1 w-[300px]">
          {invitation
            ?.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((n) => (
              <NotificationItem
                key={n._id}
                invitation={n}
                handleAction={handleAction}
              />
            ))}
        </ul>
      }
    />
  );
}
