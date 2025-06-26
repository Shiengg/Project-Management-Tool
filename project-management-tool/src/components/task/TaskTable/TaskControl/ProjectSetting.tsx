import { toastRequest } from "@/components/toast/toaster";
import Form from "@/components/UI/Form";
import React, { useContext } from "react";
import EditProject from "./ProjectSetting/EditProjectForm";
import { Delete, Edit, LogOut, Logs, Printer, Trash } from "lucide-react";
import PrintReport from "./ProjectSetting/PrintReportForm";
import ProjectLog from "./ProjectSetting/ProjectLog";
import { ProjectContext } from "../TaskTable";
import { useSession } from "next-auth/react";

export default function ProjectSetting() {
  const { data: session } = useSession();
  const { project, handleDeleteProject, handleLeaveProject } =
    useContext(ProjectContext);

  return (
    <ul className="flex flex-col [&_label]:hover:bg-white/10 [&_label]:px-3 [&_label]:p-2 text-sm [&_label]:cursor-pointer pb-2">
      {project?.admin === session?.user._id && (
        <>
          <label>
            <Form
              name="Edit Project"
              icon={
                <div className="flex flex-row gap-2 items-center">
                  <Edit size={16} />
                  Edit Project
                </div>
              }
              form={<EditProject />}
            />
          </label>

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
      <label
        className="  text-red-500 flex flex-row gap-2 items-center"
        onClick={handleLeaveProject}
      >
        <LogOut size={16} />
        Leave Project
      </label>
      {project?.admin === session?.user._id && (
        <label
          className="  text-red-500  flex flex-row gap-2 items-center"
          onClick={handleDeleteProject}
        >
          <Trash size={16} />
          Delete Project
        </label>
      )}
    </ul>
  );
}
