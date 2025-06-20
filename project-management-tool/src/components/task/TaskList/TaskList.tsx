"use client";
import { Task, TaskList } from "@/lib/types";

import React, { useContext, useEffect, useRef, useState } from "react";
import TaskCard from "../TaskCard/TaskCard";
import { Ellipsis, Plus, X } from "lucide-react";
import { DNDContext, FilterContext } from "../TaskTable/TaskTable";
import { getColorFromPercentage } from "@/lib/render";
import Menu from "../../UI/Menu";
import ActionList from "./ActionList";
import { toastRequest, toastSuccess } from "@/components/toast/toaster";
import { filterTask } from "../TaskTable/FilterAction";

export default function TaskListComponent({
  list,
  expand,
}: {
  list: TaskList;
  expand: boolean;
}) {
  const {
    hoverTaskId,
    hoverListId,
    draggingId,
    dragType,
    handleDragStart,
    handleDragOver,
    handleAddTask,
    handleDeleteList,
    handleMoveTask,
  } = useContext(DNDContext);
  const { filter: projectFilter } = useContext(FilterContext);
  const [sort, setSort] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [filter, setFilter] = useState<{
    myTask: boolean;
    completed: boolean;
    uncompleted: boolean;
  }>({
    myTask: false,
    completed: projectFilter.completed,
    uncompleted: projectFilter.uncompleted,
  });
  const [isExpand, setIsExpand] = useState(expand);
  const [tasks, setTasks] = useState(list.list);

  const [isAdding, setIsAdding] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const completion =
    tasks.length > 0
      ? (tasks.reduce((acc, t) => acc + (t.state ? 1 : 0), 0) / tasks.length) *
        100
      : 0;

  const handleDelete = async () => {
    const result = await toastRequest("Do you want to remove this list?");
    if (result) {
      handleDeleteList(list.id);
      toastSuccess("Task list removed");
    }
  };

  const handleMoveAllTaskTo = async (id: string) => {
    const result = await toastRequest(
      "Do you want to move all task from this list?"
    );
    if (result) {
    
      [...tasks].forEach((t) => {
      
        handleMoveTask(t.id, id, null);
      });
      toastSuccess("Tasks moved");
    }
  };

  useEffect(() => setIsExpand(expand), [expand]);
  useEffect(() => {
    setTasks(list.list);
  }, [list]);

  return (
    <div
      draggable={dragType !== "task"} // avoid conflicting drags
      onDragStart={(e) => {
        // only trigger if we're dragging a list
        if (dragType !== "task") handleDragStart(list.id, "list");
      }}
      onDragOver={(e) => {
        e.preventDefault();
        handleDragOver(list.id, "list");
      }}
      className={`task-list-container  
        ${draggingId === list.id ? "opacity-50" : ""} 
       
        `}
      style={{
        outline: hoverListId === list.id ? "2px solid  blue" : "none",
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
        <div
          className={`grow text-sm font-semibold rounded-md flex items-center  ${
            isExpand ? "" : "vertical-text"
          }`}
        >
          {list.name}
        </div>{" "}
        <Menu
          name="actions"
          icon={
            <button className="button-2">
              <Ellipsis size={14} />
            </button>
          }
          menu={
            <ActionList
              id={list.id}
              sort={sort}
              setSort={setSort}
              filter={filter}
              expand={isExpand}
              toggleExpand={setIsExpand}
              setFilter={setFilter}
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
              ?.filter((t) => {
                const isMine = !filter.myTask || false; // If not filtering by mine, accept all
                const isCompletedMatch = filter.completed
                  ? t.state === true
                  : filter.uncompleted
                  ? t.state === false
                  : true;

                return isMine && isCompletedMatch;
              })
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
                    return (
                      new Date(a.due).getTime() - new Date(b.due).getTime()
                    );
                  default: // No sort
                    return 0;
                }
              })
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </ul>

          {isAdding ? (
            <div className="flex flex-col gap-2 p-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Task name"
                className="input-box text-sm"
                required
                style={{
                  background: "#272727",
                }}
              />
              <div className="text-sm flex flex-row gap-1">
                <button
                  className="button-3"
                  onClick={() =>
                    handleAddTask(list.id, inputRef.current?.value || "")
                  }
                >
                  Add task
                </button>
                <button className="button-2" onClick={() => setIsAdding(false)}>
                  <X size={14} />
                </button>
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
