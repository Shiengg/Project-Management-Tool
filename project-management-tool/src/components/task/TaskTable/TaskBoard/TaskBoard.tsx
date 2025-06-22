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
import { toastWarning, toastSuccess } from "@/components/toast/toaster";
import { TaskList, Project, Task } from "@/lib/types";
import TaskDetail from "../TaskDetail";

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
  handleAddTask: (listId: string, name: string) => void;
  handleUpdateTask: (newTask: Task) => void;
  handleDeleteList: (id: string) => void;
  handleUpdateList: (id: string, name: string) => void;

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
  handleAddTask: () => {},
  handleUpdateTask: () => {},
  handleDeleteList: () => {},
  handleUpdateList: () => {},
  handleMoveTask: () => {},
});

export default function TaskBoard() {
  const { project, setProject } = useContext(ProjectContext);

  const [isAdding, setIsAdding] = useState(false);
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

  const handleAddList = (name: string) => {
    if (!name) {
      toastWarning("Please add a name for list");
      return;
    }

    const newList: TaskList = {
      id: name,
      name: name,
      list: [],
    };

    const updatedList = [...(project?.list || []), newList];

    setProject({
      ...project,
      list: updatedList,
    } as Project);

    // setTaskList(updatedList);
    toastSuccess("New task list added");
  };

  const handleUpdateList = (id: string, name: string) => {
    const updatedList = project?.list.map((tl) =>
      tl.id === id ? { ...tl, name: name.length ? name : tl.name } : tl
    );
    setProject({
      ...project,
      list: updatedList,
    } as Project);
  };

  const handleDeleteList = (id: string) => {
    const updatedList = project?.list.filter((tl) => tl.id !== id) || [];

    setProject(
      (prev) =>
        ({
          ...prev,
          list: updatedList,
        } as Project)
    );

    setDeleting(false);

    // setTaskList(updatedList);
  };

  const handleDeleteTask = (id: string) => {
    const updatedList = project?.list.map((tl) => ({
      ...tl,
      list: tl.list.filter((t) => t.id !== id),
    }));

    setProject(
      (prev) =>
        ({
          ...prev,
          list: updatedList,
        } as Project)
    );
    setDeleting(false);
  };

  const handleUpdateTask = (newTask: Task) => {
    const updatedLists = project?.list.map((list) => {
      const updatedTasks = list.list.map((task) =>
        task.id === newTask.id ? newTask : task
      );

      return { ...list, list: updatedTasks };
    });
    setProject(
      (prev) => ({ ...prev, list: updatedLists as TaskList[] } as Project)
    );
  };

  const handleAddTask = (listId: string, name: string) => {
    if (!name) return;
    const newTask: Task = {
      id: name,
      name: name,
      theme: "",
      description: "",
      member: [],
      state: false,
      createdAt: new Date(),
      due: "",
    };

    const updatedLists = project?.list.map((list) =>
      list.id === listId ? { ...list, list: [...list.list, newTask] } : list
    );

    setProject((prev) => ({ ...prev, list: updatedLists } as Project));
    // setTaskList(updatedLists as TaskList[]);
  };

  const handleMoveTask = (
    taskId: string,
    listId: string,
    toBeReplacedId: string | null
  ) => {
    if (!project) return;
    let fromListIndex = -1;
    let toListIndex = -1;
    let fromTaskIndex = -1;
    let toTaskIndex = -1;

    const updatedProject = { ...project };

    updatedProject.list.forEach((taskList, listIdx) => {
      taskList.list?.forEach((task, taskIdx) => {
        if (task.id === taskId) {
          fromListIndex = listIdx;
          fromTaskIndex = taskIdx;
        }
        if (task.id === toBeReplacedId) {
          toListIndex = listIdx;
          toTaskIndex = taskIdx;
        }
      });
      if (toBeReplacedId === null && taskList.id === listId) {
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

    setProject((prev) => updatedProject);
  };

  const handleMoveList = (from: string, to: string) => {
    if (!project) return;

    const updatedProject = { ...project };
    const fromIndex = updatedProject.list.findIndex((l) => l.id === from);
    const toIndex = updatedProject.list.findIndex((l) => l.id === to);

    const [movedList] = updatedProject.list.splice(fromIndex, 1);
    updatedProject.list.splice(toIndex, 0, movedList);

    setProject((prev) => updatedProject);
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

    if (deleting) {
      switch (dragType) {
        case "list":
          handleDeleteList(draggingId);
          break;
        case "task":
          handleDeleteTask(draggingId);
          break;
      }
      setDragType(null);
      setDraggingId(null);
      setHoverTaskId(null);
      setHoverListId(null);
      return;
    }

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
              onDrop={(e) => {
                e.preventDefault(); // still needed if drop *does* happen
                handleDrop();
              }}
              onDragOver={(e) => e.preventDefault()} // required to allow drops
              className="task-table grow z-3 "
            >
              {project?.list?.map((tl) => (
                <TaskListComponent key={tl.id} list={tl} />
              ))}
              {isAdding ? (
                <div className="flex flex-col gap-2 p-2 rounded-md bg-black">
                  <input
                    ref={inputRef}
                    required
                    type="text"
                    placeholder="List name"
                    className="input-box text-sm"
                  />
                  <div className="text-sm flex flex-row gap-1">
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
