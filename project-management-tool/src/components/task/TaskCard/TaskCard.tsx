import { Task } from "@/lib/types";
import React, { useContext, useEffect, useState } from "react";
import { DNDContext, ProjectContext, TaskDetailContext } from "../TaskTable/TaskTable";
import { Clock } from "lucide-react";
import ProfileIcon from "@/components/UI/ProfileIcon";

export default function TaskCard({ task }: { task: Task }) {
  const {
    hoverTaskId,
    draggingId,
    dragType,
    handleDragStart,
    handleDragOver,
    handleMarkComplete,
  } = useContext(DNDContext);
  const project = useContext(ProjectContext);
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
      className={`task-card cursor-pointer ${draggingId === task.id ? "opacity-50" : ""} ${hoverTaskId === task.id ? "outline-2 outline-blue-500" : ""
        }`}
    >
      {task.theme && (
        <div
          className={`background-base background-${task.theme} h-[150px] w-[250px] `}
        ></div>
      )}

      {task.due && (
        <span
          className={`flex flex-row gap-1 items-center px-1 text-xs ${task.state
            ? "text-green-300 bg-green-800"
            : "text-red-300 bg-red-800"
            } `}
        >
          <Clock size={12} />
          {task.due.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // optional: for 24h format
          })}
        </span>
      )}

      <div className="flex flex-row items-center justify-start gap-2 py-1 px-2">
        <input
          type="checkbox"
          checked={state}
          onChange={(e) => {
            e.preventDefault();
            handleMarkComplete(task.id);
            setState((prev) => !prev);
          }}
          title="mark complete"
          className={`appearance-none size-3 outline-2  outline-inherit rounded-full checked:outline-none checked:bg-green-600`}
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
