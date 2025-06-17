import React, { Dispatch, SetStateAction } from "react";

export default function ActionList({
  sort,
  setSort,
  filter,
  expand,
  setFilter,
  toggleAdd,
  toggleExpand,
  onDelete,
}: {
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
  onDelete: any;
}) {
  const handleCheckboxChange = (key: keyof typeof filter) => {
    setFilter((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filters = [
    { key: "myTask", label: "My Task" },
    { key: "completed", label: "Completed" },
    { key: "uncompleted", label: "Uncompleted" },
  ] as const;

  return (
    <ul className="flex flex-col [&>li]:hover:bg-white/10 [&>li]:px-2 [&>li]:p-1 text-xs [&>li]:cursor-pointer">
      <li onClick={() => toggleAdd(true)}>Add Task</li>
      <li onClick={() => toggleExpand(!expand)}>
        {expand ? "Collapse" : "Expand"}
      </li>
      <li onClick={onDelete}>Delete List</li>
      <hr />
      <div className="text-center p-1 text-sm font-semibold">Sorting</div>
      <li>
        <label htmlFor="Latest" className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sort === 1}
            onChange={(e) => {
              setSort(e.target.checked ? 1: 0 );
            }}
            className="appearance-none size-3 rounded-full checked:bg-gray-400 "
            id="Latest"
          />
          <span>Latest</span>
        </label>
      </li>
      <li>
        <label htmlFor="Oldest" className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sort === 2}
            onChange={(e) => {
              setSort(e.target.checked ? 2: 0 );
            }}
            className="appearance-none size-3 rounded-full checked:bg-gray-400 "
            id="Oldest"
          />
          <span>Oldest</span>
        </label>
      </li>
      <li>
        <label htmlFor="Name" className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sort === 3}
            onChange={(e) => {
              setSort(e.target.checked ? 3: 0 );
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
              setSort(e.target.checked ? 4: 0 );
            }}
            className="appearance-none size-3 rounded-full checked:bg-gray-400 "
            id="Due"
          />
          <span>Due Date</span>
        </label>
      </li>

      <hr />
      <div className="text-center p-1 text-sm font-semibold">Filter</div>
      <li>
        <label htmlFor="myTask" className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filter.myTask}
            onChange={() =>
              setFilter((prev) => ({
                ...prev,
                myTask: !prev.myTask,
              }))
            }
            className="appearance-none size-3 outline-2 outline-gray-400 rounded-full checked:bg-gray-400 checked:outline-none"
            id="myTask"
          />
          <span>My Task</span>
        </label>
      </li>
      <li>
        <label htmlFor="completed" className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filter.completed}
            onChange={() =>
              setFilter((prev) => ({
                ...prev,
                completed: !prev.completed,
                uncompleted: false,
              }))
            }
            className="appearance-none size-3 outline-2 outline-gray-400 rounded-full checked:bg-gray-400 checked:outline-none"
            id="completed"
          />
          <span>Completed</span>
        </label>
      </li>
      <li>
        <label htmlFor="uncompleted" className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filter.uncompleted}
            onChange={() =>
              setFilter((prev) => ({
                ...prev,
                completed: false,
                uncompleted: !prev.uncompleted,
              }))
            }
            className="appearance-none size-3 outline-2 outline-gray-400 rounded-full checked:bg-gray-400 checked:outline-none"
            id="uncompleted"
          />
          <span>Uncompleted</span>
        </label>
      </li>
    </ul>
  );
}
