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
  const [state, setState] = useState(task.state);
  const { setOpenTaskId } = useContext(TaskDetailContext);

  useEffect(() => {
    setState(task.state);
  }, [task.state]);

  return (
    <div
      onClick={() => setOpenTaskId(task.id)}
      draggable
      onDragStart={(e) => {
        e.stopPropagation(); // prevent parent list from reacting
        handleDragStart(task.id, "task");
      }}
      // onDragLeave={(e) => {
      //   e.preventDefault();

      //   handleDragOver(null, "task");
      // }}
      onDragOver={(e) => {
        e.preventDefault();

        handleDragOver(task.id, "task");
      }}
      className={`task-card cursor-pointer ${
        draggingId === task.id ? "opacity-50" : ""
      } ${hoverTaskId === task.id ? "outline-2 outline-blue-500" : "hover:outline-2 outline-white"}`}
    >
      {task.theme && (
        <div
          className={`background-base background-${task.theme} h-[150px] w-[250px] `}
        ></div>
      )}

      {task.due && (
        <span
          className={`flex flex-row gap-1 items-center px-1 text-xs ${
            task.state
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
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            e.preventDefault();

            handleUpdateTask({ ...task, state: e.target.checked });
            setState((prev) => !prev);
          }}
          title="mark complete"
          className={`appearance-none min-w-3 aspect-square outline-2  outline-inherit rounded-full checked:outline-none checked:bg-green-600 cursor-pointer`}
        ></input>
        <span className="text-sm font-mono">{task.name}</span>
      </div>

      <div className="flex flex-wrap gap-1 p-1">
        {task.member?.map((id) => (
          <ProfileIcon
            key={id}
            src={project?.member.find((mb) => mb.id === id)?.image || ""}
            size={16}
          />
        ))}
      </div>
    </div>
  );
}
