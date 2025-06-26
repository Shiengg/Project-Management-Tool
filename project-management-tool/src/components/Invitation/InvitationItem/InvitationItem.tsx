import { formatDate } from "@/lib/format";
import { type Invitation } from "@/lib/types";
import { Check, X } from "lucide-react";
import React from "react";

export default function InvitationItem({
  invitation,
  handleAction,
}: {
  invitation: Invitation;
  handleAction: (invitation: Invitation, state: boolean) => void;
}) {
  return (
    <div className="notification-item">
      <div className="flex flex-row">
        <div className="p-1">
          <b>{invitation.email}</b> invited you to join{" "}
          <b>{invitation.projectName}</b>.
        </div>
        <div className="grid grid-cols-2 w-fit min-w-[50px] items-center  ">
          <button
            className="button-4 aspect-square min-w-[24px]"
            onClick={() => handleAction(invitation, true)}
          >
            <Check size={24} />
          </button>
          <button
            className="button-4 aspect-square min-w-[24px]"
            onClick={() => handleAction(invitation, false)}
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="text-xs opacity-70 text-right">
        {formatDate(invitation.createdAt)}
      </div>
    </div>
  );
}
