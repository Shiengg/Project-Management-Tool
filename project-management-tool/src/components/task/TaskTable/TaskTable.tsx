'use client'
import { Project, Task, TaskList } from "@/lib/types";
import { createMockProject } from "@/services/mock/mock";
import {
  Bolt,
  ChartNoAxesColumn,
  ListFilter,
  Plus,
  TableProperties,
  Trash,
  Users,
  X,
} from "lucide-react";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import TaskListComponent from "../TaskList/TaskList";
import { Fascinate_Inline } from "next/font/google";
import { toastError, toastSuccess, toastWarning } from "../../toast/toaster";
import Menu from "../../UI/Menu";
import FilterAction, {
  defaultFilter,
  filterTask,
} from "./TaskControl/FilterForm";

import TaskDetail from "./TaskDetail";
import MemberBoard from "./TaskControl/MemberBoard";
import Form from "@/components/UI/Form";
import ProjectSetting from "./TaskControl/ProjectSetting";
import FilterForm from "./TaskControl/FilterForm";
import TaskControl from "./TaskControl/TaskControl";
import TaskBoard from "./TaskBoard/TaskBoard";

type ProjectContextType = {
  project: Project | null;
  setProject: Dispatch<SetStateAction<Project | null>>;
  handleUpdateProjectInfo: (project: Project) => void;
  handleUpdateProjectAdmin: (id: string) => void;
  handleRemoveProjectMember: (id: string) => void;
};

type FilterContextType = {
  filter: {
    keyword: string;
    notAssign: boolean;
    member: string[];
    due: 0 | 1 | 2 | 3;
    overdue: boolean;
    completed: boolean;
    uncompleted: boolean;
  };
  setFilter: Dispatch<
    SetStateAction<{
      keyword: string;
      notAssign: boolean;
      member: string[];
      due: 0 | 1 | 2 | 3;
      overdue: boolean;
      completed: boolean;
      uncompleted: boolean;
    }>
  >;
};

type ViewContextType = {
  view: boolean;
  setView: Dispatch<SetStateAction<boolean>>;
};

export const ProjectContext = createContext<ProjectContextType>({
  project: null,
  setProject: () => {},
  handleUpdateProjectInfo: () => {},
  handleUpdateProjectAdmin: () => {},
  handleRemoveProjectMember: () => {},
});
export const FilterContext = createContext<FilterContextType>({
  filter: {
    keyword: "",
    notAssign: false,
    member: [],
    due: 0,
    overdue: false,
    completed: false,
    uncompleted: false,
  },

  setFilter: () => {},
});

export const ViewContext = createContext<ViewContextType>({
  view: false,
  setView: () => {},
});

export default function TaskTable({ initProject }: { initProject: Project }) {
  const [filter, setFilter] = useState<{
    keyword: string;
    notAssign: boolean;
    member: string[];
    due: 0 | 1 | 2 | 3;
    overdue: boolean;
    completed: boolean;
    uncompleted: boolean;
  }>(defaultFilter);
  const [project, setProject] = useState<Project | null>(initProject);

  const [view, setView] = useState(true);

  const handleRemoveProjectMember = (id: string) => {
    const updatedProject: Project = {
      ...project,
      member: project?.member.filter((mb) => mb.id !== id) || [],
      list:
        project?.list.map(
          (tl: TaskList) =>
            ({
              ...tl,
              list: tl.list?.map((t: Task) =>
                t.member.includes(id)
                  ? { ...t, member: t.member.filter((mb) => mb !== id) }
                  : t
              ),
            } as TaskList)
        ) || [],
    } as Project;

    setProject(updatedProject);
  };
  const handleUpdateProjectAdmin = (id: string) => {
    setProject((prev) => ({ ...prev, admin: id } as Project));
  };

  const handleUpdateProjectInfo = (project: Project) => {
    setProject(
      (prev) =>
        ({
          ...prev,
          name: project.name,
          description: project.description,
          background: project.theme,
          state: project.state,
        } as Project)
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
        handleUpdateProjectAdmin,

        handleRemoveProjectMember,
        handleUpdateProjectInfo,
      }}
    >
      <FilterContext.Provider value={{ filter, setFilter }}>
        <ViewContext.Provider value={{ view, setView }}>
          <div
            className={`w-screen h-screen  fixed background-base background-${
              project?.theme ?? 1
            } z-1`}
          ></div>
          <div className="task-table-container z-2 ">
            <TaskControl />
            <TaskBoard />
          </div>
        </ViewContext.Provider>
      </FilterContext.Provider>
    </ProjectContext.Provider>
  );
}
