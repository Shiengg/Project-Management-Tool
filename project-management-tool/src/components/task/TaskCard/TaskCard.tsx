import { Task } from "@/lib/types";
import React, { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../TaskTable/TaskTable";
import { Clock } from "lucide-react";
import ProfileIcon from "@/components/UI/ProfileIcon";
import { formatDate } from "@/lib/format";
import {
  DNDContext,
  TaskDetailContext,
} from "../TaskTable/TaskBoard/TaskBoard";
import { useSession } from "next-auth/react";

export const renderTaskPriority = (priority: number) => {
  switch (priority) {
    case 1:
      return "Low";
    case 2:
      return "Medium";
    case 3:
      return "High";
    case 4:
      return "Urgent";
    case 5:
      return "Critical";
    default:
      return "Unknown";
  }
};

export const getPriorityColorHex = (priority: number) => {
  switch (priority) {
    case 1:
      return "#60a5fa"; // Blue-400
    case 2:
      return "#34d399"; // Green-400
    case 3:
      return "#facc15"; // Yellow-400
    case 4:
      return "#f97316"; // Orange-500
    case 5:
      return "#dc2626"; // Red-600
    default:
      return "#9ca3af"; // Gray-400
  }
};

export default function TaskCard({ task }: { task: Task }) {
  const {
    hoverTaskId,
    draggingId,
    dragType,
    handleDragStart,
    handleDragOver,
    handleUpdateTask,
  } = useContext(DNDContext);
  const { project } = useContext(ProjectContext);
  const { data: session } = useSession();
  const isAdmin = project?.admin === session?.user._id;
  const isMyTask =
    session?.user._id && task.member?.includes(session?.user._id);
  const [state, setState] = useState(task.status);
  const { setOpenTaskId } = useContext(TaskDetailContext);


  useEffect(() => {
    setState(task.status);
  }, [task.status]);

  return (
    <div
      onClick={() => setOpenTaskId(task._id)}
      draggable={isAdmin}
      onDragStart={(e) => {
        e.stopPropagation(); // prevent parent list from reacting
        handleDragStart(task._id, "task");
      }}
      // onDragLeave={(e) => {
      //   e.preventDefault();

      //   handleDragOver(null, "task");
      // }}
      onDragOver={(e) => {
        e.preventDefault();

        handleDragOver(task._id, "task");
      }}
      className={`task-card cursor-pointer ${
        draggingId === task._id ? "opacity-50" : ""
      } ${
        hoverTaskId === task._id
          ? "outline-2 outline-blue-500"
          : "hover:outline-2 outline-white"
      }`}
    >
      {task.theme && (
        <div
          className={`background-base background-${task.theme} h-[150px] w-[250px] `}
        ></div>
      )}

      {task.due && (
        <span
          className={`flex flex-row gap-1 items-center px-1 text-xs ${
            task.status
              ? "text-green-300 bg-green-800"
              : new Date(task.due) < new Date()
              ? "text-red-300 bg-red-800"
              : "text-gray-500 bg-white"
          } `}
        >
          <Clock size={12} />
          {formatDate(task.due)}
        </span>
      )}

      <div className="flex flex-row items-center justify-start gap-2 py-1 px-2">
        <input
          type="checkbox"
          checked={state}
          disabled={!isMyTask && !isAdmin}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            handleUpdateTask({ _id: task._id, status: e.target.checked });
            setState((prev) => !prev);
          }}
          title="mark complete"
          className={`appearance-none min-w-3 aspect-square outline-2  outline-inherit rounded-full checked:outline-none checked:bg-green-600 cursor-pointer`}
        ></input>
        <span
          className="text-sm font-mono font-semibold"
          style={{ color: getPriorityColorHex(task.priority) }}
        >
          {task.name}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 p-1">
        {task.member?.map((id) => (
          <ProfileIcon
            key={id}
            src={project?.member.find((mb) => mb._id === id)?.image || ""}
            size={16}
          />
        ))}
      </div>
    </div>
  );
}
