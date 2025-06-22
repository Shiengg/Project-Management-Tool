import React, { useContext } from "react";
import { FilterAndSortContext } from "../ProjectTable/ProjectTable";
import { Project } from "@/lib/types";

export const filterProject = (
  filter: {
    keyword: string;
    state: number[];
    name: -1 | 0 | 1;
    date: -1 | 0 | 1;
  },
  projects: Project[]
) => {
  return projects?.filter((pr) => {
    const keyword = filter.keyword.trim().toLowerCase();
    const matchesKeyword =
      keyword === "" || pr.name.toLowerCase().includes(keyword);

    const matchesState =
      !filter.state.length || filter.state.includes(pr.state);

    return matchesKeyword && matchesState;
  });
};
export default function ProjectFilterForm() {
  const { filter, setFilter } = useContext(FilterAndSortContext);
  return (
    <ul className="flex flex-col [&>label]:hover:bg-white/10 [&>label]:px-3 [&>label]:p-2 text-xs [&>label]:cursor-pointer pb-2">
      <hr />
      <div className="text-left p-1 py-2 text-sm font-semibold">State</div>

      <label
        htmlFor="inProgress"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          className="base-checkbox"
          type="checkbox"
          checked={filter.state.includes(0)}
          onChange={() =>
            setFilter((prev) => ({
              ...prev,
              state: filter.state.includes(0)
                ? filter.state.filter((s) => s !== 0)
                : [...filter.state, 0],
            }))
          }
          id="inProgress"
        />
        <span className="text-xs p-1 rounded bg-yellow-800 text-yellow-300">
          In-Progress
        </span>
      </label>

      <label
        htmlFor="closed"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          className="base-checkbox"
          type="checkbox"
          checked={filter.state.includes(1)}
          onChange={() =>
            setFilter((prev) => ({
              ...prev,
              state: filter.state.includes(1)
                ? filter.state.filter((s) => s !== 1)
                : [...filter.state, 1],
            }))
          }
          id="closed"
        />
        <span className="text-xs p-1 rounded bg-red-800 text-red-300">
          Closed
        </span>
      </label>

      <label
        htmlFor="completed"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          className="base-checkbox"
          type="checkbox"
          checked={filter.state.includes(2)}
          onChange={() =>
            setFilter((prev) => ({
              ...prev,
              state: filter.state.includes(2)
                ? filter.state.filter((s) => s !== 2)
                : [...filter.state, 2],
            }))
          }
          id="completed"
        />
        <span className="text-xs p-1 rounded bg-green-800 text-green-300">
          Completed
        </span>
      </label>

      <hr />
      <div className="text-left py-2 p-1 text-sm font-semibold">
        Sort by name
      </div>

      <label
        htmlFor="NoNameSort"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={filter.name === 0}
          onChange={(e) => {
            setFilter((prev) => ({
              ...prev,
              name: 0,
            }));
          }}
          className="appearance-none size-3 rounded-full checked:bg-gray-400 "
          id="NoNameSort"
        />
        <span>None</span>
      </label>

      <label
        htmlFor="NameAsc"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={filter.name === 1}
          onChange={(e) => {
            setFilter((prev) => ({
              ...prev,
              name: 1,
            }));
          }}
          className="appearance-none size-3 rounded-full checked:bg-gray-400 "
          id="NameAsc"
        />
        <span>Name ASC</span>
      </label>

      <label
        htmlFor="NameDesc"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={filter.name === -1}
          onChange={(e) => {
            setFilter((prev) => ({
              ...prev,
              name: -1,
            }));
          }}
          className="appearance-none size-3 rounded-full checked:bg-gray-400 "
          id="NameDesc"
        />
        <span>Name DESC</span>
      </label>

      <div className="text-left py-2 p-1 text-sm font-semibold">
        Sort by date
      </div>

      <label
        htmlFor="NoDateSort"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={filter.date === 0}
          onChange={(e) => {
            setFilter((prev) => ({
              ...prev,
              date: 0,
            }));
          }}
          className="appearance-none size-3 rounded-full checked:bg-gray-400 "
          id="NoDateSort"
        />
        <span>None</span>
      </label>

      <label
        htmlFor="DateAsc"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={filter.date === 1}
          onChange={(e) => {
            setFilter((prev) => ({
              ...prev,
              date: 1,
            }));
          }}
          className="appearance-none size-3 rounded-full checked:bg-gray-400 "
          id="DateAsc"
        />
        <span>Date ASC</span>
      </label>

      <label
        htmlFor="DateDesc"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={filter.date === -1}
          onChange={(e) => {
            setFilter((prev) => ({
              ...prev,
              date: -1,
            }));
          }}
          className="appearance-none size-3 rounded-full checked:bg-gray-400 "
          id="DateDesc"
        />
        <span>Date DESC</span>
      </label>
    </ul>
  );
}
