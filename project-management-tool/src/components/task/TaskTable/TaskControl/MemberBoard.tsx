"use client";
import { User } from "@/lib/types";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "../TaskTable";
import ProfileIcon from "@/components/UI/ProfileIcon";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  toastError,
  toastRequest,
  toastSuccess,
} from "@/components/toast/toaster";
import { searchUser } from "@/services/userService";
import Loader from "@/components/loader/Loader";
import { InviteMember } from "@/services/projectService";

export default function MemberBoard() {
  const { data: session } = useSession();
  const {
    project,
    handleRemoveProjectMember,
    handleUpdateProjectAdmin,
    handleAddMember,
  } = useContext(ProjectContext);
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAssignAdmin = async (member: User) => {
    const result = await toastRequest(
      `Assign ${member.email} as the new admin?`
    );
    if (result) {
      handleUpdateProjectAdmin(member._id);
    }
  };
  const handleRemoveUser = async (member: User) => {
    const result = await toastRequest(`Remove ${member.email}?`);
    if (result) {
      handleRemoveProjectMember(member._id);
    }
  };

  const handleSearch = async (keyword: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsSearching(true);
      searchUser(keyword).then((res) => {
        console.log(res);
        setUsers(res ? res : []);
        setIsSearching(false);
      });
    }, 500);
  };

  const handleInvite = async () => {
    setIsSending(true);
    await handleAddMember(selected.map((su) => su._id));
    setSelected([]);
    setIsSending(false);
  };

  return (
    <div className=" rounded-lg max-w-2xl w-full h-fit max-h-screen flex flex-col gap-2 overflow-auto">
      {project?.admin === session?.user._id && (
        <div className="rounded  bg-gray-700 p-2">
          <div className="text-lg">Search User</div>

          <input
            type="text"
            className="input-box w-full"
            placeholder="email..."
            onChange={(e) => handleSearch(e.target.value)}
          />

          <ul className="flex flex-wrap max-h-[200px] overflow-auto gap-1 py-2">
            {isSearching ? (
              <Loader />
            ) : (
              users
                ?.filter(
                  (u) => !project?.member.map((us) => us._id).includes(u._id)
                )
                .map((u) => (
                  <div
                    key={u._id}
                    onClick={() => {
                      setSelected((prev) =>
                        selected.find((su) => su._id === u._id)
                          ? prev.filter((su) => su._id !== u._id)
                          : [...prev, u]
                      );
                    }}
                    className={`flex flex-row gap-1 items-center p-1 px-2 rounded bg-gray-600 cursor-pointer`}
                  >
                    <ProfileIcon src={u.image || ""} size={24} />
                    <span className="text-xs ">{u.email}</span>
                  </div>
                ))
            )}
          </ul>

          {selected.length > 0 && (
            <div>
              <span>Invite Queue</span>
              <ul className="flex flex-wrap max-h-[200px] overflow-auto gap-1 py-2">
                {selected.map((u) => (
                  <div
                    key={u._id}
                    onClick={() =>
                      setSelected((prev) =>
                        prev.filter((su) => su._id !== u._id)
                      )
                    }
                    className={`flex flex-row gap-1 items-center p-1 px-2 rounded bg-gray-600 cursor-pointer`}
                  >
                    <ProfileIcon src={u.image || ""} size={24} />
                    <span className="text-xs ">{u.email}</span>
                  </div>
                ))}
              </ul>
              <button
                className="button w-full"
                onClick={handleInvite}
                disabled={isSending || !selected.length}
              >
                {isSending ? <Loader /> : "Send Invitation"}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="rounded  bg-gray-700 p-2">
        <div className="text-lg">Onboard</div>
        {(() => {
          const admin = project?.member.find((mb) => mb._id === project.admin);
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
            ?.filter((mb) => mb._id !== project.admin)
            .map((mb) => (
              <div key={mb._id} className="flex flex-row gap-2 items-center ">
                <ProfileIcon src={mb.image || ""} size={32} />
                <div className="flex flex-col  items-start justify-evenly text-sm grow">
                  <div>{mb.username}</div>
                  <div className="italic opacity-50 text-xs">{mb.email}</div>
                </div>

                {session?.user._id === project.admin && (
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
