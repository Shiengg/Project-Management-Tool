"use client";
import { User } from "@/lib/types";
import React, { useContext, useEffect, useState } from "react";
import { ProjectContext } from "./TaskTable";
import ProfileIcon from "@/components/UI/ProfileIcon";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { toastRequest } from "@/components/toast/toaster";

export default function MemberBoard() {
  const { data: session } = useSession();
  const { project, handleRemoveProjectMember, handleUpdateProjectAdmin } =
    useContext(ProjectContext);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const handleAssignAdmin = async (member: User) => {
    const result = await toastRequest(
      `Assign ${member.email} as the new admin?`
    );
    if (result) {
      handleUpdateProjectAdmin(member.id);
    }
  };
  const handleRemoveUser = async (member: User) => {
    const result = await toastRequest(`Remove ${member.email}?`);
    if (result) {
      handleRemoveProjectMember(member.id);
    }
  };

  return (
    <div className=" rounded-lg max-w-2xl w-full h-fit max-h-screen flex flex-col gap-2">
      <div className="rounded  bg-gray-700 p-2">
        <div className="text-lg">Invite Member</div>

        <input
          type="text"
          className="input-box w-full"
          placeholder="email..."
        />

        <ul className="flex flex-col max-h-[200px] gap-2"></ul>
      </div>

      <div className="rounded  bg-gray-700 p-2">
        <div className="text-lg">Onboard</div>
        {(() => {
          const admin = project?.member.find((mb) => mb.id === project.admin);
          if (!admin) return null;
          return (
            <div className="flex flex-row gap-2 items-center ">
              <ProfileIcon src={admin.image || ""} size={32} />
              <div className="flex flex-col  items-start justify-evenly text-sm grow">
                <div>{admin.username}</div>
                <div className="italic opacity-50 text-xs">{admin.email}</div>
              </div>

              <span className="text-sm px-2 p-1 bg-white text-gray-500 rounded">
                Admin
              </span>
            </div>
          );
        })()}
        <ul className="flex flex-col max-h-[200px] gap-2 py-2">
          {project?.member
            ?.filter((mb) => mb.id !== project.admin)
            .map((mb) => (
              <div key={mb.id} className="flex flex-row gap-2 items-center ">
                <ProfileIcon src={mb.image || ""} size={32} />
                <div className="flex flex-col  items-start justify-evenly text-sm grow">
                  <div>{mb.username}</div>
                  <div className="italic opacity-50 text-xs">{mb.email}</div>
                </div>

                {true && (
                  <div className="flex items-center gap-1">
                    <button
                      className="button-3 text-sm"
                      onClick={() => handleAssignAdmin(mb)}
                    >
                      Assign
                    </button>
                    <button
                      className="button-3 text-sm"
                      onClick={() => handleRemoveUser(mb)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
}
