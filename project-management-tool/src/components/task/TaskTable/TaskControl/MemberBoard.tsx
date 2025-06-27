"use client";
import { User } from "@/lib/types";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "../TaskTable";
import ProfileIcon from "@/components/UI/ProfileIcon";
import { Search, ShieldUser, X } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  toastError,
  toastRequest,
  toastSuccess,
} from "@/components/toast/toaster";
import { searchUser } from "@/services/userService";
import Loader from "@/components/loader/Loader";
import { InviteMember } from "@/services/projectService";
import { Input } from "@/components/UI/input";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/UI/alert-dialog";

export default function MemberBoard() {
  const { data: session } = useSession();
  const {
    project,
    handleRemoveProjectMember,
    handleUpdateProjectAdmin,
    handleAddMember,
  } = useContext(ProjectContext);
  const isAdmin = project?.admin === session?.user._id
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (keyword: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsSearching(true);
      searchUser(keyword).then((res) => {
        setUsers(res ? res : []);
        setIsSearching(false);
      });
    }, 500);
  };

  const handleAssign = async (id: string) => {
    setIsLoading(true);
    handleUpdateProjectAdmin(id).then((res) => {
      setSelected([]);
      setIsLoading(false);
    });
  };
  const handleRemove = async (id: string) => {
    setIsLoading(true);
    handleRemoveProjectMember(id).then((res) => {
      setSelected([]);
      setIsLoading(false);
    });
  };

  const handleInvite = async () => {
    setIsLoading(true);
    handleAddMember(selected.map((su) => su._id)).then((res) => {
      setSelected([]);
      setIsLoading(false);
    });
  };

  return (
    <div className=" rounded-lg w-full  h-fit max-h-screen flex flex-col gap-2 overflow-auto">
      {isAdmin && (
        <div className="rounded  bg-gray-700 p-2">
          <div className="text-lg">Search User</div>

          <div className="relative group ">
            <Input
              id="search"
              type="text"
              name="search"
              placeholder="email..."
              onChange={(e) => handleSearch(e.target.value)}
              className="  pl-10 h-10 sm:h-12 w-full text-sm sm:text-base rounded-lg border-2 border-white/20 bg-black/20 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder:text-gray-300"
              maxLength={30}
              required
            />
            <Search className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-white/70 group-hover:text-blue-300 transition-colors duration-200" />
          </div>

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
                    className={`flex flex-row gap-2 items-center p-2 rounded bg-gray-600 cursor-pointer`}
                  >
                    <ProfileIcon src={u} size={24} />
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
                    className={`flex flex-row gap-2 items-center p-1 px-2 rounded bg-gray-600 cursor-pointer`}
                  >
                    <ProfileIcon src={u} size={24} />
                    <span className="text-xs ">{u.email}</span>
                  </div>
                ))}
              </ul>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="button w-full"
                    disabled={isLoading || !selected.length}
                  >
                    Send Invitation
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent onMouseDown={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Admin Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Invite new members to your project? <br />
                      The following users will be invited to your project:{" "}
                      <br />
                      <div className="flex flex-wrap gap-1">
                        {selected.map((u) => (
                          <div
                            key={u._id}
                            className={`flex flex-row gap-2 items-center p-1 px-2 rounded bg-gray-300 text-gray-800`}
                          >
                            <ProfileIcon src={u} size={24} />
                            <span className="text-xs ">{u.email}</span>
                          </div>
                        ))}
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleInvite}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        "Invite"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      )}

      <div className="rounded  bg-gray-700 p-2 space-y-4">
        {(() => {
          const admin = project?.member.find((mb) => mb._id === project.admin);
          if (!admin) return null;
          return (
            <div className="flex flex-row gap-2 items-center bg-gray-500 p-2 rounded-full">
              <ProfileIcon src={admin} size={32} />
              <div className="flex flex-col  items-start justify-evenly text-sm grow">
                <div>{admin.username}</div>
                <div className="italic opacity-50 text-xs">{admin.email}</div>
              </div>
              <span className="text-sm p-1 bg-white text-gray-500 rounded-full">
                <ShieldUser />
              </span>
            </div>
          );
        })()}

        <div>
          <div className="text-lg">Onboard</div>
          <ul className="flex flex-col max-h-[200px] gap-2 py-2">
            {project?.member
              ?.filter((mb) => mb._id !== project.admin)
              .map((mb) => (
                <div key={mb._id} className="flex flex-row gap-2 items-center ">
                  <ProfileIcon src={mb} size={32} />
                  <div className="flex flex-col  items-start justify-evenly text-sm grow">
                    <div>{mb.username}</div>
                    <div className="italic opacity-50 text-xs">{mb.email}</div>
                  </div>
                  {session?.user._id === project.admin && (
                    <div className="flex items-center gap-1">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="button-3 text-sm"
                            disabled={isLoading}
                          >
                            Assign
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Admin Confirmation
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Assign {mb.email} as the new admin? <br />
                              You will no longer have admin privileges.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleAssign(mb._id)}
                              disabled={isLoading}
                              className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
                            >
                              {isLoading ? (
                                <div className="flex items-center gap-2">
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  <span>Assigning...</span>
                                </div>
                              ) : (
                                "Assign"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="button-3 text-sm"
                            disabled={isLoading}
                          >
                            Remove
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Remove Confirmation
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Remove {mb.email} from the project? <br />
                              {mb.email} will be removed from involved tasks.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemove(mb._id)}
                              disabled={isLoading}
                              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            >
                              {isLoading ? (
                                <div className="flex items-center gap-2">
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  <span>Removing...</span>
                                </div>
                              ) : (
                                "Remove"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
