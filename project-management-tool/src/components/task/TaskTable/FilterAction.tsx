import React, { Dispatch, SetStateAction, useContext, useRef } from "react";
import { FilterContext, ProjectContext } from "./TaskTable";
import ProfileIcon from "@/components/UI/ProfileIcon";
import { Clock, Search } from "lucide-react";
import { Task } from "@/lib/types";

export const defaultFilter = {
  keyword: "",
  notAssign: false,
  member: [],
  due: 0,
  overdue: false,
  completed: false,
  uncompleted: false,
} as {
  keyword: string;
  notAssign: boolean;
  member: string[];
  due: 0 | 1 | 2 | 3;
  overdue: boolean;
  completed: boolean;
  uncompleted: boolean;
};

export const filterTask = (
  filter: {
    keyword: string;
    notAssign: boolean;
    member: string[];
    due: 0 | 1 | 2 | 3;
    overdue: boolean;
    completed: boolean;
    uncompleted: boolean;
  },
  list: Task[]
) => {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const endOfTomorrow = new Date(startOfTomorrow);
  endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const startOfMonth = new Date(
    startOfToday.getFullYear(),
    startOfToday.getMonth(),
    1
  );
  const endOfMonth = new Date(
    startOfMonth.getFullYear(),
    startOfMonth.getMonth() + 1,
    1
  );

  return list.filter((task) => {
    const taskDue = new Date(task.due);

    // 1. Keyword
    if (
      filter.keyword &&
      !task.name.toLowerCase().includes(filter.keyword.toLowerCase()) &&
      !task.description.toLowerCase().includes(filter.keyword.toLowerCase())
    ) {
      return false;
    }

    // 2. Not assigned
    if (filter.notAssign && task.member.length > 0) {
      return false;
    }

    // 3. Member (OR logic)
    if (filter.member.length > 0) {
      const hasMatch = filter.member.some((id) => task.member.includes(id));
      if (!hasMatch) return false;
    }

    // 4. Due filter
    if (filter.due === 1) {
      // Tomorrow
      if (taskDue < startOfTomorrow || taskDue >= endOfTomorrow) return false;
    } else if (filter.due === 2) {
      // This week
      if (taskDue < startOfWeek || taskDue >= endOfWeek) return false;
    } else if (filter.due === 3) {
      // This month
      if (taskDue < startOfMonth || taskDue >= endOfMonth) return false;
    }

    // 5. Overdue
    if (filter.overdue && (taskDue >= now)) {
      return false;
    }

    // 6. Completed
    if (filter.completed && !task.state) {
      return false;
    }

    // 7. Uncompleted
    if (filter.uncompleted && task.state) {
      return false;
    }

    return true;
  });
};

export default function FilterAction({}) {
  const { filter, setFilter } = useContext(FilterContext);
  const {project} = useContext(ProjectContext);
  const ref = useRef<NodeJS.Timeout | null>(null);
  return (
    <ul className="flex flex-col [&>li]:hover:bg-white/10 [&>li]:px-3 [&>li]:p-2 text-xs [&>li]:cursor-pointer pb-2">
      <hr />
      <div className="text-left p-1 py-2 text-sm font-semibold">Keyword</div>
      <div className="flex flex-row items-center px-2 bg-white/10 p-1">
        <input
          onChange={(e) => {
            if (ref.current) clearTimeout(ref.current);
            ref.current = setTimeout(
              () =>
                setFilter((prev) => ({
                  ...prev,
                  keyword: e.target.value,
                })),
              500
            );
          }}
          type="text"
          placeholder="Search"
          className="input-box grow"
        />
        <Search size={24} className="p-1"/>
      </div>
      <hr />
      <div className="text-left p-1 py-2 text-sm font-semibold">State</div>
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
      <br />
      <hr />
      <div className="text-left p-1 py-2 text-sm font-semibold">
        Assigned Member
      </div>
      <li>
        <label
          htmlFor="notAssign"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            className="base-checkbox"
            type="checkbox"
            checked={filter.notAssign}
            onChange={() =>
              setFilter((prev) => ({
                ...prev,
                notAssign: !prev.notAssign,
              }))
            }
            id="notAssign"
          />
          <span>No Members</span>
        </label>
      </li>
      {project?.member?.map((m) => (
        <li key={m.id}>
          <label
            htmlFor={m.id}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              className="base-checkbox"
              type="checkbox"
              checked={filter.member.includes(m.id)}
              onChange={() =>
                setFilter((prev) => ({
                  ...prev,
                  member: prev.member.includes(m.id)
                    ? prev.member.filter((mb) => mb !== m.id)
                    : [...prev.member, m.id],
                }))
              }
              id={m.id}
            />
            <div className="flex flex-row gap-2">
              <ProfileIcon src={m.image || ""} size={32} />
              <div className="flex flex-col gap-1 items-start justify-evenly">
                <div>{m.username}</div>
                <div className="italic opacity-50">{m.email}</div>
              </div>
            </div>
          </label>
        </li>
      ))}
      <br />
      <hr />
      <div className="text-left p-1 py-2 text-sm font-semibold">Due Date</div>
      <li>
        <label
          htmlFor="overdue"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            className="base-checkbox"
            type="checkbox"
            checked={filter.overdue}
            onChange={() =>
              setFilter((prev) => ({
                ...prev,
                overdue: !prev.overdue,
              }))
            }
            id="overdue"
          />
          <div className="flex flex-row gap-1 items-center">
            {" "}
            <Clock
              size={24}
              className="text-white bg-red-400 rounded-full p-1"
            />{" "}
            Overdue
          </div>
        </label>
      </li>
      <li>
        <label
          htmlFor="dueTomorrow"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            className="base-checkbox"
            type="checkbox"
            checked={filter.due === 1}
            onChange={() =>
              setFilter((prev) => ({
                ...prev,
                due: prev.due === 1 ? 0 : 1,
              }))
            }
            id="dueTomorrow"
          />
          <div className="flex flex-row gap-1 items-center">
            {" "}
            <Clock
              size={24}
              className="text-white bg-yellow-400 rounded-full p-1"
            />{" "}
            Due in the next day
          </div>
        </label>
      </li>{" "}
      <li>
        <label
          htmlFor="dueNextWeek"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            className="base-checkbox"
            type="checkbox"
            checked={filter.due === 2}
            onChange={() =>
              setFilter((prev) => ({
                ...prev,
                due: prev.due === 2 ? 0 : 2,
              }))
            }
            id="dueNextWeek"
          />
          <div className="flex flex-row gap-1 items-center">
            <Clock
              size={24}
              className="text-white bg-gray-400 rounded-full p-1"
            />{" "}
            Due in the next week
          </div>
        </label>
      </li>{" "}
      <li>
        <label
          htmlFor="dueNextMonth"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            className="base-checkbox"
            type="checkbox"
            checked={filter.due === 3}
            onChange={() =>
              setFilter((prev) => ({
                ...prev,
                due: prev.due === 3 ? 0 : 3,
              }))
            }
            id="dueNextMonth"
          />
          <div className="flex flex-row gap-1 items-center">
            <Clock
              size={24}
              className="text-white bg-gray-400 rounded-full p-1"
            />{" "}
            Due in the next month
          </div>
        </label>
      </li>
    </ul>
  );
}
