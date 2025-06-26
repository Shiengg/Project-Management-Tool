import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ProjectContext } from "../TaskTable";
import { X, Plus, Trash } from "lucide-react";
import TaskListComponent from "../../TaskList/TaskList";
import {
  toastWarning,
  toastSuccess,
  toastError,
} from "@/components/toast/toaster";
import { TaskList, Project, Task } from "@/lib/types";
import TaskDetail from "../TaskDetail";
import { getSocket } from "@/services/socket/socket";
import useSocket from "@/hooks/useSocket";
import { socketContext } from "@/components/Layout/Nav";
import {
  createList,
  deleteList,
  moveList,
  updateList,
} from "@/services/listService";
import { PROJECT_CHANNEL } from "@/constant/socketChannel";
import { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import Loader from "@/components/loader/Loader";
import {
  createTask,
  deleteTask,
  moveTask,
  updateTask,
} from "@/services/taskService";
import { emit } from "process";

type DNDContextType = {
  draggingId: string | null;
  hoverTaskId: string | null;
  hoverListId: string | null;
  dragType: "list" | "task" | null;
  handleDragStart: (id: string, type: "list" | "task" | null) => void;
  handleDragOver: (
    targetId: string | null,
    type: "list" | "task" | null
  ) => void;
  handleAddTask: (listId: string, name: string) => Promise<void>;
  handleUpdateTask: (newTask: any) => Promise<void>;
  handleDeleteList: (id: string) => Promise<void>;
  handleUpdateList: (id: string, name: string) => Promise<void>;

  handleMoveTask: (
    taskId: string,
    listId: string,
    toBeReplacedId: string | null
  ) => void;
};

type TaskDetailContextType = {
  openTaskId: string | null;
  setOpenTaskId: (id: string | null) => void;
};

export const TaskDetailContext = createContext<TaskDetailContextType>({
  openTaskId: null,
  setOpenTaskId: () => {},
});

export const DNDContext = createContext<DNDContextType>({
  draggingId: null,
  hoverTaskId: null,
  hoverListId: null,
  dragType: null,
  handleDragStart: () => {},
  handleDragOver: () => {},
  handleAddTask: async () => {},
  handleUpdateTask: async () => {},
  handleDeleteList: async () => {},
  handleUpdateList: async () => {},
  handleMoveTask: () => {},
});

export default function TaskBoard() {
  const { data: session } = useSession();
  const { project, setProject } = useContext(ProjectContext);
  const isAdmin = project?.admin === session?.user._id;

  const socket = useContext(socketContext);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [dragType, setDragType] = useState<"list" | "task" | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverTaskId, setHoverTaskId] = useState<string | null>(null);
  const [hoverListId, setHoverListId] = useState<string | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragStart = (id: string, type: "list" | "task" | null) => {
    setDraggingId(id);
    setDragType(type);
  };

  const handleAddList = async (name: string) => {
    if (!project) return;
    if (!name) {
      toastWarning("Please add a name for list");
      return;
    }
    setIsLoading(true);
    createList(project._id, name).then((res) => {
      if (res) {
        const updatedList = [...(project.list || []), res.taskList];

        setProject({
          ...project,
          list: updatedList,
        } as Project);

        // setTaskList(updatedList);
        toastSuccess("New task list added");

        if (socket) {
          const payload = {
            projectId: project._id,
            newList: res.taskList,
          };
          socket.emit(PROJECT_CHANNEL.ADD_LIST, payload);
          socket.emit(PROJECT_CHANNEL.LOG, {
            projectId: project._id,
            log: res.log,
          });
        }
      } else {
        toastError("Failed to add task list");
      }
      setIsLoading(false);
    });
  };

  const handleUpdateList = async (id: string, name: string) => {
    if (name && project) {
      updateList(project._id, id, name).then((res) => {
        if (res && socket) {
          socket.emit(PROJECT_CHANNEL.LOG, {
            projectId: project._id,
            log: res.log,
          });
        }
      });

      setProject(
        (prev) =>
          ({
            ...prev,
            list: prev?.list.map((tl) =>
              tl._id === id ? { ...tl, name: name } : tl
            ),
          } as Project)
      );

      if (socket) {
        const payload = {
          projectId: project._id,
          listId: id,
          name: name,
        };
        socket.emit(PROJECT_CHANNEL.UPDATE_LIST, payload);
      }
    }
  };

  const handleDeleteList = async (id: string) => {
    console.log("delete");
    if (!project) return;
    setProject(
      (prev) =>
        ({
          ...prev,
          list: prev?.list.filter((tl) => tl._id !== id) || [],
        } as Project)
    );

    if (socket) {
      const payload = {
        projectId: project._id,
        listId: id,
      };
      socket.emit(PROJECT_CHANNEL.DELETE_LIST, payload);
    }
    deleteList(project._id, id).then((res) => {
      if (res) {
        if (socket) {
          socket.emit(PROJECT_CHANNEL.LOG, {
            projectId: project._id,
            log: res.log,
          });
        }
      } else {
        toastError("Failed to delete list");
      }
    });

    // setTaskList(updatedList);
  };

  const handleDeleteTask = async (id: string) => {
    if (!project) return;

    setProject(
      (prev) =>
        ({
          ...prev,
          list: prev?.list.map((tl) => ({
            ...tl,
            list: tl.list.filter((t) => t._id !== id),
          })),
        } as Project)
    );

    if (socket) {
      const payload = {
        projectId: project._id,
        taskId: id,
      };

      socket.emit(PROJECT_CHANNEL.DELETE_TASK, payload);
    }

    setDeleting(false);
    deleteTask(project._id, id).then((res) => {
      if (res && socket) {
        socket.emit(PROJECT_CHANNEL.LOG, {
          projectId: project._id,
          log: res.log,
        });
      }
    });
  };

  const handleUpdateTask = async (newTask: any) => {
    if (!project) return;

    const { _id, ...payload } = newTask;

    setProject(
      (prev) =>
        ({
          ...prev,
          list: prev?.list.map((list) => {
            const updatedTasks = list.list.map((task) =>
              task._id === _id ? Object.assign(task, newTask) : task
            );

            return { ...list, list: updatedTasks };
          }) as TaskList[],
        } as Project)
    );

    if (socket) {
      const socketPayload = {
        projectId: project._id,
        updateTask: newTask,
      };
      socket.emit(PROJECT_CHANNEL.UPDATE_TASK, socketPayload);
    }

    updateTask(project._id, newTask._id, payload).then((res) => {
      if (res && socket) {
        socket.emit(PROJECT_CHANNEL.LOG, {
          projectId: project._id,
          log: res.log,
        });
      }
    });
  };

  const handleAddTask = async (listId: string, name: string) => {
    if (!name || !project) return;

    createTask(project._id, listId, name).then((res) => {
      if (res) {
        setProject(
          (prev) =>
            ({
              ...prev,
              list: prev?.list.map((list) =>
                list._id === listId
                  ? { ...list, list: [...list.list, res.task] }
                  : list
              ),
            } as Project)
        );

        if (socket) {
          const payload = {
            projectId: project._id,
            listId,
            newTask: res.task,
          };
          socket.emit(PROJECT_CHANNEL.ADD_TASK, payload);

          socket.emit(PROJECT_CHANNEL.LOG, {
            projectId: project._id,
            log: res.log,
          });
        }
      } else {
        toastError("Failed to create task");
      }
    });

    // setTaskList(updatedLists as TaskList[]);
  };

  const handleMoveTask = async (
    taskId: string,
    listId: string,
    toBeReplacedId: string | null
  ) => {
    if (!project) return;

    setProject((prev) => {
      if (!prev) return null;
      let fromListIndex = -1;
      let toListIndex = -1;
      let fromTaskIndex = -1;
      let toTaskIndex = -1;

      const updatedProject = { ...prev };

      updatedProject.list.forEach((taskList, listIdx) => {
        taskList.list?.forEach((task, taskIdx) => {
          if (task._id === taskId) {
            fromListIndex = listIdx;
            fromTaskIndex = taskIdx;
          }
          if (task._id === toBeReplacedId) {
            toListIndex = listIdx;
            toTaskIndex = taskIdx;
          }
        });
        if (toBeReplacedId === null && taskList._id === listId) {
          toListIndex = listIdx;
          toTaskIndex = taskList.list.length;
        }
      });

      if (fromListIndex !== -1 && toListIndex !== -1) {
        const [movedTask] = updatedProject.list[fromListIndex].list.splice(
          fromTaskIndex,
          1
        );
        updatedProject.list[toListIndex].list.splice(toTaskIndex, 0, movedTask);
      }
      return updatedProject;
    });

    if (socket) {
      const payload = {
        projectId: project._id,
        fromId: taskId,
        listId: listId,
        toId: toBeReplacedId,
      };
      socket.emit(PROJECT_CHANNEL.MOVE_TASK, payload);
    }

    moveTask(project._id, taskId, listId, toBeReplacedId).then((res) => {
      if (res && socket) {
        socket.emit(PROJECT_CHANNEL.LOG, {
          projectId: project._id,
          log: res.log,
        });
      }
    });
  };

  const handleMoveList = (from: string, to: string) => {
    if (!project) return;

    setProject((prev) => {
      if (!prev) return null;
      const updatedProject = { ...prev };
      const fromIndex = updatedProject.list.findIndex((l) => l._id === from);
      const toIndex = updatedProject.list.findIndex((l) => l._id === to);

      const [movedList] = updatedProject.list.splice(fromIndex, 1);
      updatedProject.list.splice(toIndex, 0, movedList);

      if (socket) {
        const payload = {
          projectId: project._id,
          fromId: from,
          toId: to,
        };
        socket.emit(PROJECT_CHANNEL.MOVE_LIST, payload);
      }

      return updatedProject as Project;
    });

    moveList(project._id, from, to).then((res) => {
      if (res && socket) {
        socket.emit(PROJECT_CHANNEL.LOG, {
          projectId: project._id,
          log: res.log,
        });
      }
    });
  };

  const handleDragOver = (
    targetId: string | null,
    type: "list" | "task" | "del" | null
  ) => {
    switch (type) {
      case "list":
        setHoverListId(targetId);
        return;
      case "task":
        setHoverTaskId(targetId);
        return;
      case "del":
        setDeleting(true);
      default:
        return;
    }
  };

  const handleDrop = () => {
    if (!draggingId || !dragType || !project) return;

    if (dragType === "list" && hoverListId && draggingId !== hoverListId) {
      handleMoveList(draggingId, hoverListId);
    }

    if (dragType === "task" && hoverListId && draggingId !== hoverTaskId) {
      handleMoveTask(draggingId, hoverListId, hoverTaskId);
    }

    setDragType(null);
    setDraggingId(null);
    setHoverTaskId(null);
    setHoverListId(null);
  };

  useEffect(() => {
    const onMouseLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && draggingId) {
        console.log("Mouse left the window");
        handleDrop();
      }
    };

    const onDragLeave = (e: DragEvent) => {
      if (!e.relatedTarget && draggingId) {
        console.log("Dragging left the body");
        handleDrop();
      }
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      handleDrop();
    };

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const onDragEnd = () => {
      handleDrop();
    };

    document.addEventListener("mouseleave", onMouseLeave);
    document.body.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragend", onDragEnd);

    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      document.body.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragend", onDragEnd);
    };
  }, [draggingId]);

  const onListAdded = (taskList: TaskList) => {
    setProject(
      (prev) =>
        ({
          ...prev,
          list: [...(prev?.list || []), taskList],
        } as Project)
    );
  };
  const onListRemoved = (id: string) => {
    setProject(
      (prev) =>
        ({
          ...prev,
          list: prev?.list.filter((tl) => tl._id !== id) || [],
        } as Project)
    );
  };

  const onListUpdated = (list: { listId: string; name: string }) => {
    setProject(
      (prev) =>
        ({
          ...prev,
          list: prev?.list.map((tl) =>
            tl._id === list.listId ? { ...tl, name: list.name } : tl
          ),
        } as Project)
    );
  };

  const onListMoved = (move: { fromId: string; toId: string }) => {
    if (!project) return;
    const { fromId: from, toId: to } = move;

    setProject((prev) => {
      if (!prev) return null;
      const updatedProject = { ...prev };
      const fromIndex = updatedProject.list.findIndex((l) => l._id === from);
      const toIndex = updatedProject.list.findIndex((l) => l._id === to);

      const [movedList] = updatedProject.list.splice(fromIndex, 1);
      updatedProject.list.splice(toIndex, 0, movedList);
      return updatedProject as Project;
    });
  };

  const onTaskAdded = (task: { listId: string; newTask: Task }) => {
    setProject(
      (prev) =>
        ({
          ...prev,
          list: prev?.list.map((list) =>
            list._id === task.listId
              ? { ...list, list: [...list.list, task.newTask] }
              : list
          ),
        } as Project)
    );
  };
  const onTaskRemoved = (id: string) => {
    setProject(
      (prev) =>
        ({
          ...prev,
          list: prev?.list.map((tl) => ({
            ...tl,
            list: tl.list.filter((t) => t._id !== id),
          })),
        } as Project)
    );
  };
  const onTaskUpdated = (newTask: Task) => {
    setProject(
      (prev) =>
        ({
          ...prev,
          list: prev?.list.map((list) => {
            const updatedTasks = list.list.map((task) =>
              task._id === newTask._id ? Object.assign(task, newTask) : task
            );

            return { ...list, list: updatedTasks };
          }) as TaskList[],
        } as Project)
    );
  };
  const onTaskMoved = (move: {
    fromId: string;
    listId: string;
    toId: string;
  }) => {
    const { fromId, listId, toId } = move;
    setProject((prev) => {
      if (!prev) return null;
      let fromListIndex = -1;
      let toListIndex = -1;
      let fromTaskIndex = -1;
      let toTaskIndex = -1;

      const updatedProject = { ...prev };

      updatedProject.list.forEach((taskList, listIdx) => {
        taskList.list?.forEach((task, taskIdx) => {
          if (task._id === fromId) {
            fromListIndex = listIdx;
            fromTaskIndex = taskIdx;
          }
          if (task._id === toId) {
            toListIndex = listIdx;
            toTaskIndex = taskIdx;
          }
        });
        if (toId === null && taskList._id === listId) {
          toListIndex = listIdx;
          toTaskIndex = taskList.list.length;
        }
      });

      if (fromListIndex !== -1 && toListIndex !== -1) {
        const [movedTask] = updatedProject.list[fromListIndex].list.splice(
          fromTaskIndex,
          1
        );
        updatedProject.list[toListIndex].list.splice(toTaskIndex, 0, movedTask);
      }
      return updatedProject;
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(PROJECT_CHANNEL.ADD_LIST, onListAdded);
    socket.on(PROJECT_CHANNEL.DELETE_LIST, onListRemoved);
    socket.on(PROJECT_CHANNEL.UPDATE_LIST, onListUpdated);
    socket.on(PROJECT_CHANNEL.MOVE_LIST, onListMoved);
    socket.on(PROJECT_CHANNEL.ADD_TASK, onTaskAdded);
    socket.on(PROJECT_CHANNEL.DELETE_TASK, onTaskRemoved);
    socket.on(PROJECT_CHANNEL.UPDATE_TASK, onTaskUpdated);
    socket.on(PROJECT_CHANNEL.MOVE_TASK, onTaskMoved);
    return () => {
      socket.off(PROJECT_CHANNEL.ADD_LIST, onListAdded);
      socket.off(PROJECT_CHANNEL.DELETE_LIST, onListRemoved);
      socket.off(PROJECT_CHANNEL.UPDATE_LIST, onListUpdated);
      socket.off(PROJECT_CHANNEL.MOVE_LIST, onListMoved);
      socket.off(PROJECT_CHANNEL.ADD_TASK, onTaskAdded);
      socket.off(PROJECT_CHANNEL.DELETE_TASK, onTaskRemoved);
      socket.off(PROJECT_CHANNEL.UPDATE_TASK, onTaskUpdated);
      socket.off(PROJECT_CHANNEL.MOVE_TASK, onTaskMoved);
    };
  }, [project?._id, socket]);

  useEffect(() => {
    setHoverTaskId(null);
  }, [hoverListId]);

  return (
    <>
      {project?.state === 1 || !project ? (
        <div className="bg-black/50 size-full z-3 flex flex-col items-center justify-center text-xl">
          Project Unavailable
        </div>
      ) : (
        <DNDContext.Provider
          value={{
            draggingId,
            hoverTaskId,
            hoverListId,
            dragType,
            handleDragStart,
            handleDragOver,
            handleUpdateTask,
            handleAddTask,
            handleDeleteList,
            handleUpdateList,
            handleMoveTask,
          }}
        >
          <TaskDetailContext.Provider value={{ openTaskId, setOpenTaskId }}>
            <div
              draggable={isAdmin}
              onDrop={(e) => {
                e.preventDefault(); // still needed if drop *does* happen
                handleDrop();
              }}
              onDragOver={(e) => e.preventDefault()} // required to allow drops
              className="task-table grow z-3 "
            >
              {project?.list?.map((tl) => (
                <TaskListComponent key={tl._id} list={tl} />
              ))}
              {!isAdmin ? null : isAdding ? (
                <div className="flex flex-col gap-2 p-2 rounded-md bg-black">
                  <input
                    ref={inputRef}
                    readOnly={isLoading}
                    required
                    type="text"
                    placeholder="List name"
                    className="input-box text-sm"
                  />
                  <div className="text-sm flex flex-row gap-1">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <>
                        <button
                          className="button-3"
                          onClick={() =>
                            handleAddList(inputRef.current?.value || "")
                          }
                        >
                          Add list
                        </button>
                        <button
                          className="button-2"
                          onClick={() => setIsAdding(false)}
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="p-2 rounded-md bg-slate-400/30 backdrop-blur-sm hover:bg-slate-400/60 flex flex-row items-center gap-2 font-semibold text-sm "
                >
                  {" "}
                  <Plus /> Add new list
                </button>
              )}
            </div>
            {draggingId && (
              <div
                onDrop={(e) => {
                  e.stopPropagation();
                  switch (dragType) {
                    case "list":
                      handleDeleteList(draggingId);
                      break;
                    case "task":
                      handleDeleteTask(draggingId);
                      break;
                  }
                  setDeleting(false);
                  setDragType(null);
                  setDraggingId(null);
                  setHoverTaskId(null);
                  setHoverListId(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  handleDragOver("", "del");
                }}
                onDragLeave={(e) => {
                  setDeleting(false);
                }}
                className={`transition-colors z-50 fixed bottom-0 w-full duration-150 flex flex-col items-center gap-2 justify-between p-2   text-red-400 outline-2 outline-inherit 
              ${deleting ? "bg-red-600" : "bg-red-900"}
              `}
              >
                <Trash />
                <span>Drop here to remove</span>
              </div>
            )}
            {openTaskId && <TaskDetail key={openTaskId} taskId={openTaskId} />}
          </TaskDetailContext.Provider>
        </DNDContext.Provider>
      )}
    </>
  );
}
