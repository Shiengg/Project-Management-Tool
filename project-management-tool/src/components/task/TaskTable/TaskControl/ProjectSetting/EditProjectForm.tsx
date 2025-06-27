"use client";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { ProjectContext } from "../../TaskTable";
import ProfileIcon from "@/components/UI/ProfileIcon";
import { Project } from "@/lib/types";
import { theme } from "@/components/theme/ThemeManager";
import { Album, ListCollapse, ShieldUser, WholeWord } from "lucide-react";
import Menu from "@/components/UI/Menu";
import Link from "next/link";
import {
  toastRequest,
  toastSuccess,
  toastWarning,
} from "@/components/toast/toaster";
import Loader from "@/components/loader/Loader";
import { useSession } from "next-auth/react";

export default function EditProject() {
  const { data: session } = useSession();
  const { project: systemContext, handleUpdateProjectInfo } =
    useContext(ProjectContext);
  const isAdmin = systemContext?.admin === session?.user._id;
  const [project, setProject] = useState<Project | null>(systemContext);
  const [isLoading, setIsLoading] = useState(false);

  const stateMap = ["In-Progress", "Closed", "Completed"];

  useEffect(() => {
    if (systemContext) {
      setProject(systemContext);
    }
  }, [systemContext]);

  const handleUpdateProject = async (event: FormEvent) => {
    event.preventDefault();
    if (project) {
      setIsLoading(true);
      await handleUpdateProjectInfo(project);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <form
      onSubmit={handleUpdateProject}
      className="[&div_label]:text-gray-400 flex flex-col gap-4 overflow-auto p-2 [&_label]:group-hover:text-blue-500 [&_label]:font-semibold [&_*]:transition-all duration-200 ease-in-out"
    >
      <div className="grid grid-cols-[auto_1fr]   gap-2 items-center group">
        <WholeWord className="group-hover:text-blue-400" />

        <label>Project Name</label>
        <div></div>
        <input
          type="text"
          value={project?.name}
          readOnly={!isAdmin}
          onChange={(e) =>
            setProject((prev) => ({ ...prev, name: e.target.value } as Project))
          }
          required
          className="text-xl input-box w-full"
        />
      </div>

      <div className="grid grid-cols-[auto_1fr]   gap-2 items-center group">
        <ListCollapse className="group-hover:text-blue-400" />

        <label>Project Description</label>
        <div></div>
        <textarea
          value={project?.description}
          readOnly={!isAdmin}
          onChange={(e) =>
            setProject(
              (prev) => ({ ...prev, description: e.target.value } as Project)
            )
          }
          className="text-area "
        />
      </div>

      <div className="grid grid-cols-[auto_1fr]   gap-2 items-center group">
        <Album className="group-hover:text-blue-400" />
        <label>Project State</label>
        <div></div>

        <ul className="grid grid-cols-3 gap-1 items-center">
          {[0, 1, 2].map((s) => (
            <button
              type="button"
              disabled={!isAdmin}
              onClick={() =>
                setProject((prev) => ({ ...prev, state: s } as Project))
              }
              key={s}
              className={` text-sm p-1 rounded cursor-pointer ${
                project?.state === s
                  ? "outline-current outline-2"
                  : "opacity-30"
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

      <div className="grid grid-cols-[auto_1fr]   gap-2 items-center group">
        <div
          className={`aspect-[2/1] w-6 rounded background-base background-${project?.theme}`}
        ></div>
        <label>Board Background</label>
        <div></div>
        {isAdmin ? (
          <ul className="flex flex-wrap gap-2 p-1 panel-1 ">
            {theme.map((category) => (
              <div key={category.name} className=" min-w-[200px] grow">
                <h2 className=" font-semibold mb-2">{category.name}</h2>
                <div className="grid grid-cols-3 gap-1">
                  {category.background.map((bg) => (
                    <button
                      type="button"
                      onClick={() =>
                        setProject(
                          (prev) => ({ ...prev, theme: bg } as Project)
                        )
                      }
                      key={bg}
                      className={`rounded aspect-[2/1] w-full  shadow-md background-base  background-${bg} cursor-pointer ${
                        project?.theme === bg
                          ? "outline-2 outline-gray-500"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <div className={`background-base background-${project?.theme} aspect-[2/1] w-full rounded`}></div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="p-1 rounded text-green-400 bg-green-800 text-center cursor-pointer grow"
        >
          {isLoading ? <Loader /> : "Update Project"}
        </button>
      </div>
    </form>
  );
}
