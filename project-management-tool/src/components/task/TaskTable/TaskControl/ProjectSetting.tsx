import { toastRequest } from "@/components/toast/toaster";
import Form from "@/components/UI/Form";
import React, { useContext, useState } from "react";
import EditProject from "./ProjectSetting/EditProjectForm";
import {
  Delete,
  Edit,
  LogOut,
  Logs,
  Printer,
  Shield,
  ShieldUser,
  Trash,
} from "lucide-react";
import PrintReport from "./ProjectSetting/PrintReportForm";
import ProjectLog from "./ProjectSetting/ProjectLog";
import { ProjectContext } from "../TaskTable";
import { useSession } from "next-auth/react";
import ProfileIcon from "@/components/UI/ProfileIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/UI/alert-dialog";
import { Button } from "@/components/UI/button";

export default function ProjectSetting() {
  const { data: session } = useSession();
  const { project, handleDeleteProject, handleLeaveProject } =
    useContext(ProjectContext);
  const isAdmin = project?.admin === session?.user._id;

  const [isLoading, setIsLoading] = useState(false);

  const handleLeave = async () => {
    setIsLoading(true);
    handleLeaveProject().then((res) => {
      setTimeout(() => setIsLoading(false), 1000);
    });
  };
  const handleDelete = async () => {
    setIsLoading(true);
    handleDeleteProject().then((res) => {
      setTimeout(() => setIsLoading(false), 1000);
    });
  };

  return (
    <ul className="flex flex-col [&_label]:hover:bg-white/10 [&_label]:px-3 [&_label]:p-2 text-sm [&_label]:cursor-pointer pb-2">
      {(() => {
        const admin = project?.member.find((mb) => mb._id === project.admin);
        if (!admin) return null;
        return (
          <div className="flex flex-row gap-2 items-center  w-full panel-1 p-2">
            <ProfileIcon src={admin} size={32} />
            <div className="flex flex-col  items-start justify-evenly text-sm grow">
              <div>{admin.username}</div>
              <div className="italic opacity-50 text-xs">{admin.email}</div>
            </div>

            <span className="text-sm p-1 bg-gray-500 text-white  rounded">
              <ShieldUser />
            </span>
          </div>
        );
      })()}
      <hr />
      {isAdmin && (
        <>
          <label>
            <Form
              name="Project Report"
              icon={
                <div className="flex flex-row gap-2 items-center">
                  <Printer size={16} />
                  Print Report
                </div>
              }
              form={<PrintReport />}
            />
          </label>
        </>
      )}
      <label>
        <Form
          name="Edit Project"
          icon={
            <div className="flex flex-row gap-2 items-center">
              <Edit size={16} />
              Project Info
            </div>
          }
          form={<EditProject />}
        />
      </label>
      <label>
        <Form
          name="Project Logs"
          icon={
            <div className="flex flex-row gap-2 items-center">
              <Logs size={16} />
              Project Logs
            </div>
          }
          form={<ProjectLog />}
        />
      </label>
      {/*  */}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <label className="  text-red-500 flex flex-row gap-2 items-center">
            <LogOut size={16} />
            Leave Project
          </label>
        </AlertDialogTrigger>
        <AlertDialogContent onMouseDown={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Leaving Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this project?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeave}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Leaving...</span>
                </div>
              ) : (
                "Leave"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {project?.admin === session?.user._id && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <label className="  text-red-500 flex flex-row gap-2 items-center">
              <Trash size={16} />
              Delete Project
            </label>
          </AlertDialogTrigger>
          <AlertDialogContent onMouseDown={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this project? <br />
                All data will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Leave"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </ul>
  );
}
