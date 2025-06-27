"use client";
import { Log, Project, Task, TaskList, User } from "@/lib/types";
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
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import TaskListComponent from "../TaskList/TaskList";
import { Fascinate_Inline } from "next/font/google";
import {
  toastError,
  toastRequest,
  toastSuccess,
  toastWarning,
} from "../../toast/toaster";
import Menu from "../../UI/Menu";
import FilterAction, {
  defaultFilter,
  filterTask,
  SystemFilterType,
} from "./TaskControl/FilterForm";

import TaskDetail from "./TaskDetail";
import MemberBoard from "./TaskControl/MemberBoard";
import Form from "@/components/UI/Form";
import ProjectSetting from "./TaskControl/ProjectSetting";
import FilterForm from "./TaskControl/FilterForm";
import TaskControl from "./TaskControl/TaskControl";
import TaskBoard from "./TaskBoard/TaskBoard";
import {
  deleteProject,
  getProject,
  InviteMember,
  RemoveMember,
  updateProject,
} from "@/services/projectService";
import { useSession } from "next-auth/react";
import useSocket from "@/hooks/useSocket";
import { PROJECT_CHANNEL } from "@/constant/socketChannel";
import { Socket } from "socket.io-client";
import { socketContext } from "@/components/Layout/Nav";

type ProjectContextType = {
  project: Project | null;
  setProject: Dispatch<SetStateAction<Project | null>>;
  handleUpdateProjectInfo: (project: Project) => Promise<void>;
  handleUpdateProjectAdmin: (id: string) => Promise<void>;
  handleRemoveProjectMember: (id: string) => Promise<void>;
  handleDeleteProject: () => Promise<void>;
  handleLeaveProject: () => Promise<void>;
  handleAddMember: (ids: string[]) => Promise<void>;
};

type FilterContextType = {
  filter: SystemFilterType;
  setFilter: Dispatch<SetStateAction<SystemFilterType>>;
};

type ViewContextType = {
  view: boolean;
  setView: Dispatch<SetStateAction<boolean>>;
};

export const ProjectContext = createContext<ProjectContextType>({
  project: null,
  setProject: () => {},
  handleUpdateProjectInfo: async () => {},
  handleUpdateProjectAdmin: async () => {},
  handleRemoveProjectMember: async () => {},
  handleDeleteProject: async () => {},
  handleLeaveProject: async () => {},
  handleAddMember: async () => {},
});
export const FilterContext = createContext<FilterContextType>({
  filter: defaultFilter,

  setFilter: () => {},
});

export const ViewContext = createContext<ViewContextType>({
  view: false,
  setView: () => {},
});

export default function TaskTable({ initProject }: { initProject: Project }) {
  const { data: session } = useSession();
  const socket = useContext(socketContext);
  const [filter, setFilter] = useState<SystemFilterType>(defaultFilter);
  const [project, setProject] = useState<Project | null>(initProject);

  const [view, setView] = useState(true);

  const handleRemoveProjectMember = async (id: string) => {
    RemoveMember(initProject._id, id).then((res) => {
      if (res) {
        const updatedProject: Project = {
          ...project,
          member: project?.member.filter((mb) => mb._id !== id) || [],
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
        toastSuccess("Member removed");

        if (socket) {
          const payload = {
            projectId: initProject._id,
            userId: id,
          };
          socket.emit(PROJECT_CHANNEL.LEAVE_PROJECT, payload);
          socket.emit(PROJECT_CHANNEL.LOG, {
            projectId: initProject._id,
            log: res.log,
          });
        }
      } else {
        toastError("Failed to remove member");
      }
    });
  };
  const handleUpdateProjectAdmin = async (id: string) => {
    updateProject(initProject._id, { admin: id }).then((res) => {
      if (res) {
        setProject((prev) => ({ ...prev, admin: id } as Project));
        toastSuccess("Admin updated");
        if (socket) {
          const payload = {
            projectId: initProject._id,
            adminId: id,
          };
          socket.emit(PROJECT_CHANNEL.ASSIGN_ADMIN, payload);
          socket.emit(PROJECT_CHANNEL.LOG, {
            projectId: initProject._id,
            log: res.log,
          });
        }
      } else {
        toastError("Failed to update admin");
      }
    });
  };

  const handleUpdateProjectInfo = async (project: Project) => {
    const updates = {
      name: project.name,
      description: project.description,
      theme: project.theme,
      state: project.state,
    };
    updateProject(project._id, updates).then((res) => {
      if (res) {
        setProject(
          (prev) =>
            ({
              ...prev,
              ...updates,
            } as Project)
        );

        toastSuccess("Project updated");

        //emit socket here

        if (socket) {
          const payload = {
            projectId: initProject._id,
            name: project.name,
            description: project.description,
            state: project.state,
            theme: project.theme,
          };
          socket.emit(PROJECT_CHANNEL.UPDATE_PROJECT_INFO, payload);
          socket.emit(PROJECT_CHANNEL.LOG, {
            projectId: initProject._id,
            log: res.log,
          });
        }
      } else {
        toastError("Failed to update project");
      }
    });
  };

  const handleDeleteProject = async () => {
    if (!session?.user._id) return;

    deleteProject(initProject._id).then((res) => {
      if (res) {
        toastSuccess("Project deleted");
        if (socket) {
          socket.emit(PROJECT_CHANNEL.DELETE_PROJECT, {
            projectId: initProject._id,
          });
        }
        window.location.href = "/dashboard";
      } else {
        toastError("Failed to delete project");
      }
    });
  };

  const handleLeaveProject = async () => {
    if (!session?.user._id) return;

    if (project?.admin === session.user._id) {
      toastWarning("Can't leave while being the admin");
      return;
    }

    RemoveMember(initProject._id, session.user._id).then((res) => {
      if (res) {
        window.location.href = "/dashboard";
        if (socket) {
          const payload = {
            projectId: initProject._id,
            userId: session.user._id,
          };
          socket.emit(PROJECT_CHANNEL.LEAVE_PROJECT, payload);
          socket.emit(PROJECT_CHANNEL.LOG, {
            projectId: initProject._id,
            log: res.log,
          });
        }
      } else {
        toastError("Failed to leave");
      }
    });
  };

  const handleAddMember = async (ids: string[]) => {
    InviteMember(initProject._id, ids).then((res) => {
      toastSuccess("Invitations Sent!!!");
      if (socket) {
        res.forEach((i: { userId: string; _id: string }) => {
          const invitation = {
            projectId: initProject._id,
            projectName: project?.name,
            userId: i.userId,
            email: session?.user.email,
            createdAt: new Date(),
            _id: i._id,
          };
          socket.emit(PROJECT_CHANNEL.ADD_MEMBER, invitation);
        });
      }
    });
  };

  const onLog = (log: Log) => {
    console.log(log);
    setProject(
      (prev) => ({ ...prev, log: [log, ...(prev?.log || [])] } as Project)
    );
  };

  const onUpdateProjectInfo = (updates: {
    name: string;
    description: string;
    state: 0 | 1 | 2;
    theme: string;
  }) => {
    setProject(
      (prev) =>
        ({
          ...prev,
          ...updates,
        } as Project)
    );
    toastSuccess("Project info updated!!!");
  };
  const onUpdateProjectAdmin = (admin: string) => {
    setProject(
      (prev) =>
        ({
          ...prev,
          admin,
        } as Project)
    );
    toastSuccess(
      admin === session?.user._id
        ? "You have been assigned new admin!!!"
        : "New admin assigned!!!"
    );
  };

  const onMemberJoin = (user: User) => {
    setProject(
      (prev) =>
        ({
          ...prev,
          member: [...(prev?.member || []), user],
        } as Project)
    );

    toastSuccess(`${user.email} joined the project`);
  };

  const onMemberRemoved = (userId: string) => {
    if (session?.user._id === userId) {
      toastWarning("You have been removed from the project!!!");
      window.location.href = "/dashboard";
    } else {
      const updatedProject: Project = {
        ...project,
        member: project?.member.filter((mb) => mb._id !== userId) || [],
        list:
          project?.list.map(
            (tl: TaskList) =>
              ({
                ...tl,
                list: tl.list?.map((t: Task) =>
                  t.member.includes(userId)
                    ? { ...t, member: t.member.filter((mb) => mb !== userId) }
                    : t
                ),
              } as TaskList)
          ) || [],
      } as Project;

      setProject(updatedProject);
    }
  };

  const onProjectDeleted = () => {
    toastWarning("Project has been deleted!!!");
    window.location.href = "/dashboard";
  };

  useEffect(() => {
    if (!socket) return;

    socket.emit(PROJECT_CHANNEL.JOIN_ROOM, initProject._id);
    socket.on(PROJECT_CHANNEL.UPDATE_PROJECT_INFO, onUpdateProjectInfo);
    socket.on(PROJECT_CHANNEL.ASSIGN_ADMIN, onUpdateProjectAdmin);
    socket.on(PROJECT_CHANNEL.JOIN_PROJECT, onMemberJoin);
    socket.on(PROJECT_CHANNEL.LEAVE_PROJECT, onMemberRemoved);
    socket.on(PROJECT_CHANNEL.DELETE_PROJECT, onProjectDeleted);
    socket.on(PROJECT_CHANNEL.LOG, onLog);
    return () => {
      socket.emit(PROJECT_CHANNEL.LEAVE_ROOM, initProject._id);
      socket.off(PROJECT_CHANNEL.UPDATE_PROJECT_INFO, onUpdateProjectInfo);
      socket.off(PROJECT_CHANNEL.ASSIGN_ADMIN, onUpdateProjectAdmin);
      socket.off(PROJECT_CHANNEL.JOIN_PROJECT, onMemberJoin);
      socket.off(PROJECT_CHANNEL.LEAVE_PROJECT, onMemberRemoved);
      socket.off(PROJECT_CHANNEL.DELETE_PROJECT, onProjectDeleted);
      socket.off(PROJECT_CHANNEL.LOG, onLog);
    };
  }, [socket, initProject._id]);

  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
        handleUpdateProjectAdmin,
        handleRemoveProjectMember,
        handleUpdateProjectInfo,
        handleDeleteProject,
        handleLeaveProject,
        handleAddMember,
      }}
    >
      <FilterContext.Provider value={{ filter, setFilter }}>
        <ViewContext.Provider value={{ view, setView }}>
          <div
            className={`w-screen h-screen  fixed top-0 background-base background-${
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
