import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { ProjectContext } from "../TaskTable/TaskTable";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ActionList({
  id,
  sort,
  setSort,
  expand,
  toggleAdd,
  toggleExpand,
  handleMoveAllTaskTo,
  onDelete,
}: {
  id: string;
  sort: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  expand: boolean;
  setSort: Dispatch<SetStateAction<0 | 1 | 2 | 3 | 4 | 5 | 6>>;
  toggleAdd: Dispatch<SetStateAction<boolean>>;
  toggleExpand: Dispatch<SetStateAction<boolean>>;
  handleMoveAllTaskTo: (id: string) => void;
  onDelete: any;
}) {
  const { data: session } = useSession();
  const { project } = useContext(ProjectContext);
  const isAdmin = project?.admin === session?.user._id;
  const [moving, setMoving] = useState(false);

  return (
    <ul className="flex flex-col [&_label]:hover:bg-white/10 [&_label]:px-3 [&_label]:p-2 text-sm [&_label]:cursor-pointer pb-2">
      <label onClick={() => toggleExpand(!expand)}>
        {expand ? "Collapse" : "Expand"}
      </label>
      {isAdmin && (
        <>
          <label onClick={() => toggleAdd(true)}>Add Task</label>
          <label onClick={onDelete}>Delete List</label>
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
                  ?.filter((tl) => tl._id !== id)
                  .map((tl) => (
                    <label
                      key={tl._id}
                      onClick={() => handleMoveAllTaskTo(tl._id)}
                    >
                      {tl.name}
                    </label>
                  ))}
              </ul>
            </div>
          ) : (
            <label onClick={() => setMoving(true)} className="flex flex-row">
              Move all tasks to{" "}
              <div className=" -mx-3 -m-2 ml-auto p-2">
                <ChevronRight size={16} />
              </div>
            </label>
          )}
        </>
      )}

      <hr />
      <div className="text-left py-2 p-1 text-sm font-semibold">Sorting</div>

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

      <label htmlFor="Name" className="flex items-center gap-2 cursor-pointer">
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

      <label
        htmlFor="LowPriority"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={sort === 5}
          onChange={(e) => {
            setSort(e.target.checked ? 5 : 0);
          }}
          className="appearance-none size-3 rounded-full checked:bg-gray-400 "
          id="LowPriority"
        />
        <span>Low Priority</span>
      </label>
      <label
        htmlFor="HighPriority"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={sort === 6}
          onChange={(e) => {
            setSort(e.target.checked ? 6 : 0);
          }}
          className="appearance-none size-3 rounded-full checked:bg-gray-400 "
          id="HighPriority"
        />
        <span>High Priority</span>
      </label>
    </ul>
  );
}
