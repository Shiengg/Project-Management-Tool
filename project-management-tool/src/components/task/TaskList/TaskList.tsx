"use client";
import { Task, TaskList } from "@/lib/types";

import React, { useContext, useEffect, useRef, useState } from "react";
import TaskCard from "../TaskCard/TaskCard";
import { Ellipsis, Plus, X } from "lucide-react";
import {
  FilterContext,
  ProjectContext,
  ViewContext,
} from "../TaskTable/TaskTable";
import { getColorFromPercentage } from "@/lib/render";
import Menu from "../../UI/Menu";
import ActionList from "./ActionList";
import { toastRequest, toastSuccess } from "@/components/toast/toaster";
import { filterTask } from "../TaskTable/TaskControl/FilterForm";
import { DNDContext } from "../TaskTable/TaskBoard/TaskBoard";
import Loader from "@/components/loader/Loader";
import { useSession } from "next-auth/react";

export default function TaskListComponent({ list }: { list: TaskList }) {
  const {
    hoverTaskId,
    hoverListId,
    draggingId,
    dragType,
    handleDragStart,
    handleDragOver,
    handleAddTask,
    handleDeleteList,
    handleUpdateList,
    handleMoveTask,
  } = useContext(DNDContext);
  const { filter: projectFilter } = useContext(FilterContext);
  const { project } = useContext(ProjectContext);
  const { view } = useContext(ViewContext);
  const { data: session } = useSession();

  const isAdmin = session?.user._id === project?.admin;

  const [sort, setSort] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
  const [isExpand, setIsExpand] = useState(false);
  const [tasks, setTasks] = useState(list.list);

  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const completion =
    tasks.length > 0
      ? (tasks.reduce((acc, t) => acc + (t.status ? 1 : 0), 0) / tasks.length) *
        100
      : 0;

  const handleDelete = async () => {
    const result = await toastRequest("Do you want to remove this list?");
    if (result) {
      handleDeleteList(list._id);
    }
  };

  const handleMoveAllTaskTo = async (id: string) => {
    const result = await toastRequest(
      "Do you want to move all task from this list?"
    );
    if (result) {
      [...tasks].forEach((t) => {
        handleMoveTask(t._id, id, null);
      });
      toastSuccess("Tasks moved");
    }
  };

  const handleAddNewTask = async () => {
    setIsLoading(true);
    await handleAddTask(list._id, inputRef.current?.value || "");
    setTimeout(() => setIsLoading(false), 1000);
  };

  useEffect(() => setIsExpand(view), [view]);
  useEffect(() => {
    setTasks(list.list);
  }, [list]);

  return (
    <div
      draggable={dragType !== "task" && isAdmin} // avoid conflicting drags
      onDragStart={(e) => {
        // only trigger if we're dragging a list
        if (dragType !== "task") handleDragStart(list._id, "list");
      }}
      onDragOver={(e) => {
        e.preventDefault();
        handleDragOver(list._id, "list");
      }}
      className={`task-list-container overflow-visible  ${
        draggingId === list._id ? "opacity-50" : ""
      } `}
      style={{
        outline: hoverListId === list._id ? "2px solid  blue" : "none",
      }}
    >
      <div
        className="transition-all ease-in-out duration-200 origin-left"
        style={{
          height: "4px",
          borderRadius: "10px",
          width: "100%",
          transform: `scaleX(${completion}%)`,
          backgroundColor: getColorFromPercentage(completion),
        }}
      ></div>
      <div className={`flex ${isExpand ? "flex-row" : "flex-col"} gap-2 `}>
        <input
          ref={nameRef}
          readOnly={!isAdmin}
          defaultValue={list.name}
          type="text"
          className={`input-box grow text-sm font-semibold ${
            isExpand ? "" : "vertical-text"
          }`}
          onBlur={(e) => {
            const value = e.target.value.trim();
            if (value === "") {
              if (nameRef.current) {
                nameRef.current.value = list.name || "";
              }
            } else {
              handleUpdateList(list._id, value);
            }
          }}
        />

        <Menu
          name="actions"
          icon={
            <button className="button-2">
              <Ellipsis size={18} />
            </button>
          }
          menu={
            <ActionList
              id={list._id}
              sort={sort}
              setSort={setSort}
              expand={isExpand}
              toggleExpand={setIsExpand}
              toggleAdd={setIsAdding}
              onDelete={handleDelete}
              handleMoveAllTaskTo={handleMoveAllTaskTo}
            />
          }
        />
      </div>

      {isExpand && (
        <>
          <ul className="task-list">
            {filterTask(projectFilter, tasks)
              .sort((a, b) => {
                switch (sort) {
                  case 1: // Latest (newest first)
                    return (
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                    );
                  case 2: // Oldest (oldest first)
                    return (
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                    );
                  case 3: // Name (alphabetical)
                    return a.name.localeCompare(b.name);
                  case 4: // Due date
                    // both null → equal
                    if (a.due == null && b.due == null) return 0;
                    // a has no due → put it after b
                    if (a.due == null) return 1;
                    // b has no due → put a before b
                    if (b.due == null) return -1;
                    // both have dates → compare normally
                    return (
                      new Date(a.due).getTime() - new Date(b.due).getTime()
                    );
                  case 5: // Low Priority
                    return a.priority - b.priority;
                  case 6: // High Priority
                    return b.priority - a.priority;
                  default: // No sort
                    return 0;
                }
              })
              .map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
          </ul>

          {!isAdmin ? null : isAdding ? (
            <div className="flex flex-col gap-2 p-1">
              <input
                ref={inputRef}
                readOnly={isLoading}
                type="text"
                placeholder="Task name"
                className="input-box text-sm"
                required
                style={{
                  background: "#272727",
                }}
              />
              <div className="text-sm flex flex-row gap-1">
                {isLoading ? (
                  <Loader />
                ) : (
                  <>
                    <button
                      disabled={isLoading}
                      className="button-3"
                      onClick={handleAddNewTask}
                    >
                      Add task
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
              className="button-2 w-full flex items-center gap-2"
            >
              {" "}
              <Plus size={18} /> Add a task
            </button>
          )}
        </>
      )}
    </div>
  );
}
