import { formatDate } from "@/lib/format";
import { type Notification } from "@/lib/types";
import { Check, X } from "lucide-react";
import React from "react";

export default function NotificationItem({
  notification,
  handleAction,
}: {
  notification: Notification;
  handleAction: (id: string, state: boolean) => void;
}) {
  return (
    <div className="notification-item">
      <div className="flex flex-row">
        <div className="p-1">
          <b>{notification.email}</b> invited you to join{" "}
          <b>{notification.projectName}</b>.
        </div>
        <div className="grid grid-cols-2 w-fit">
          <button
            className="button-4"
            onClick={() => handleAction(notification.id, true)}
          >
            <Check size={24} />
          </button>
          <button
            className="button-4"
            onClick={() => handleAction(notification.id, false)}
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="text-xs opacity-70 text-right">
        {formatDate(notification.createdAt)}
      </div>
    </div>
  );
}
