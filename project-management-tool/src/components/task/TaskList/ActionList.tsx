import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { ProjectContext } from "../TaskTable/TaskTable";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function ActionList({
  id,
  sort,
  setSort,
  filter,
  expand,
  setFilter,
  toggleAdd,
  toggleExpand,
  handleMoveAllTaskTo,
  onDelete,
}: {
  id: string;
  sort: 0 | 1 | 2 | 3 | 4;
  filter: {
    myTask: boolean;
    completed: boolean;
    uncompleted: boolean;
  };
  expand: boolean;
  setSort: Dispatch<SetStateAction<0 | 1 | 2 | 3 | 4>>;
  setFilter: Dispatch<
    SetStateAction<{
      myTask: boolean;
      completed: boolean;
      uncompleted: boolean;
    }>
  >;
  toggleAdd: Dispatch<SetStateAction<boolean>>;
  toggleExpand: Dispatch<SetStateAction<boolean>>;
  handleMoveAllTaskTo: (id: string) => void;
  onDelete: any;
}) {
  const {project} = useContext(ProjectContext);
  const [moving, setMoving] = useState(false);

  return (
    <ul className="flex flex-col [&_li]:hover:bg-white/10 [&_li]:px-3 [&_li]:p-2 text-sm [&_li]:cursor-pointer pb-2">
      <li onClick={() => toggleAdd(true)}>Add Task</li>
      <li onClick={() => toggleExpand(!expand)}>
        {expand ? "Collapse" : "Expand"}
      </li>
      <li onClick={onDelete}>Delete List</li>
      {moving ? (
        <div className="flex flex-col ">
          <div className="flex flex-row px-3 p-2 gap-3 ">
            <button
              onClick={() => setMoving(false)}
              className=" -mx-3 -m-2  p-2  hover:bg-white/10"
            >
              <ChevronLeft size={16} />
            </button>{" "}
            Move to
          </div>
          <ul className="flex flex-col bg-white/10">
            {project?.list
              ?.filter((tl) => tl.id !== id)
              .map((tl) => (
                <li key={tl.id} onClick={() => handleMoveAllTaskTo(tl.id)}>
                  {tl.name}
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <li onClick={() => setMoving(true)} className="flex flex-row">
          Move all tasks to{" "}
          <div className=" -mx-3 -m-2 ml-auto p-2">
            <ChevronRight size={16} />
          </div>
        </li>
      )}
      <hr />
      <div className="text-left py-2 p-1 text-sm font-semibold">Sorting</div>
      <li>
        <label
          htmlFor="Latest"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={sort === 1}
            onChange={(e) => {
              setSort(e.target.checked ? 1 : 0);
            }}
            className="appearance-none size-3 rounded-full checked:bg-gray-400 "
            id="Latest"
          />
          <span>Latest</span>
        </label>
      </li>
      <li>
        <label
          htmlFor="Oldest"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={sort === 2}
            onChange={(e) => {
              setSort(e.target.checked ? 2 : 0);
            }}
            className="appearance-none size-3 rounded-full checked:bg-gray-400 "
            id="Oldest"
          />
          <span>Oldest</span>
        </label>
      </li>
      <li>
        <label
          htmlFor="Name"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={sort === 3}
            onChange={(e) => {
              setSort(e.target.checked ? 3 : 0);
            }}
            className="appearance-none size-3 rounded-full checked:bg-gray-400 "
            id="Name"
          />
          <span>Name</span>
        </label>
      </li>
      <li>
        <label htmlFor="Due" className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sort === 4}
            onChange={(e) => {
              setSort(e.target.checked ? 4 : 0);
            }}
            className="appearance-none size-3 rounded-full checked:bg-gray-400 "
            id="Due"
          />
          <span>Due Date</span>
        </label>
      </li>

      <hr />
      <div className="text-left p-1 py-2 text-sm font-semibold">Filter</div>
      <li>
        <label
          htmlFor="myTask"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            className="base-checkbox"
            type="checkbox"
            checked={filter.myTask}
            onChange={() =>
              setFilter((prev) => ({
                ...prev,
                myTask: !prev.myTask,
              }))
            }
            id="myTask"
          />
          <span>My Task</span>
        </label>
      </li>
      <li>
        <label
          htmlFor="completed"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            className="base-checkbox"
            type="checkbox"
            checked={filter.completed}
            onChange={() =>
              setFilter((prev) => ({
                ...prev,
                completed: !prev.completed,
                uncompleted: false,
              }))
            }
            id="completed"
          />
          <span>Completed</span>
        </label>
      </li>
      <li>
        <label
          htmlFor="uncompleted"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            className="base-checkbox"
            type="checkbox"
            checked={filter.uncompleted}
            onChange={() =>
              setFilter((prev) => ({
                ...prev,
                completed: false,
                uncompleted: !prev.uncompleted,
              }))
            }
            id="uncompleted"
          />
          <span>Uncompleted</span>
        </label>
      </li>
    </ul>
  );
}
