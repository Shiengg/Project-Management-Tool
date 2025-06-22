"use client";
import React, { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../TaskTable";
import ProfileIcon from "@/components/UI/ProfileIcon";
import { Project } from "@/lib/types";
import { theme } from "@/components/theme/ThemeManager";
import { Album, ListCollapse, ShieldUser, WholeWord } from "lucide-react";
import Menu from "@/components/UI/Menu";
import Link from "next/link";
import { toastRequest, toastWarning } from "@/components/toast/toaster";

export default function ProjectSetting() {
  const { project: systemContext, handleUpdateProjectInfo } =
    useContext(ProjectContext);
  const [project, setProject] = useState<Project | null>(systemContext);

  const stateMap = ["In-Progress", "Closed", "Completed"];

  useEffect(() => {
    if (systemContext) {
      setProject(systemContext);
    }
  }, [systemContext]);

  const handleUpdateProject = async () => {
    if (!project?.name) {
      toastWarning("Please add a name for your project");
      return;
    }
    if (!project?.description) {
      toastWarning("Please add description for your project");
      return;
    }
    const result = await toastRequest("Update project?");
    if (result) {
      handleUpdateProjectInfo(project);
    }
  };
  const handleDeleteProject = async () => {
    const result = await toastRequest("Delete this project?");
    if (result) {
    }
  };
  return (
    <div className="[&div_label]:text-gray-400 flex flex-col gap-4 overflow-auto p-2">
      <div className="grid grid-cols-[auto_1fr]   gap-2 items-center">
        <WholeWord />

        <label>Project Name</label>
        <div></div>
        <input
          type="text"
          value={project?.name}
          onChange={(e) =>
            setProject((prev) => ({ ...prev, name: e.target.value } as Project))
          }
          className="text-xl input-box w-full"
        />
      </div>

      <div className="grid grid-cols-[auto_1fr]   gap-2 items-center">
        <ListCollapse />

        <label>Project Description</label>
        <div></div>
        <textarea
          value={project?.description}
          onChange={(e) =>
            setProject(
              (prev) => ({ ...prev, description: e.target.value } as Project)
            )
          }
          className="text-area "
        />
      </div>

      <div className="grid grid-cols-[auto_1fr]   gap-2 items-center">
        <ShieldUser />

        <label>Project Admin</label>
        <div></div>
        {(() => {
          const admin = project?.member.find((mb) => mb.id === project.admin);
          if (!admin) return null;
          return (
            <div className="flex flex-row gap-2 items-center  w-full panel-1 p-2">
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
      </div>
      <div className="grid grid-cols-[auto_1fr]   gap-2 items-center">
        <Album />
        <label>Project State</label>
        <div></div>
        <ul className="flex flex-wrap gap-2 items-center">
          {[0, 1, 2].map((s) => (
            <button
              onClick={() =>
                setProject((prev) => ({ ...prev, state: s } as Project))
              }
              key={s}
              className={` text-sm p-1 rounded ${
                project?.state === s ? "" : "opacity-30"
              } ${
                s === 0
                  ? " bg-yellow-800 text-yellow-300"
                  : s === 1
                  ? "text-red-300 bg-red-800"
                  : "text-green-300 bg-green-800"
              }`}
            >
              {stateMap[s] ?? "Unknown"}
            </button>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-[auto_1fr]   gap-2 items-center">
        <div
          className={`aspect-[2/1] w-6 rounded background-base background-${project?.theme}`}
        ></div>
        <label>Board Background</label>
        <div></div>
        <ul className="flex flex-col gap-2 p-1 panel-1 ">
          {theme.map((category) => (
            <div key={category.name} className="pb-4">
              <h2 className=" font-semibold mb-2">{category.name}</h2>
              <div className="flex flex-wrap gap-3">
                {category.background.map((bg) => (
                  <button
                    onClick={() =>
                      setProject((prev) => ({ ...prev, theme: bg } as Project))
                    }
                    key={bg}
                    className={`rounded-lg aspect-[2/1] max-w-[50px] grow min-w-[50px]  shadow-md background-base  background-${bg} cursor-pointer ${
                      project?.theme === bg ? "outline-2 outline-gray-500" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="p-1 rounded text-green-400 bg-green-800 text-center cursor-pointer grow"
          onClick={handleUpdateProject}
        >
          Update Project
        </button>
        <button
          className="p-1 rounded text-red-400 bg-red-800 text-center cursor-pointer grow"
          onClick={handleDeleteProject}
        >
          Leave Project
        </button>
        <button
          className="p-1 rounded text-red-400 bg-red-800 text-center cursor-pointer grow"
          onClick={handleDeleteProject}
        >
          Delete Project
        </button>
      </div>
    </div>
  );
}
