import Form from "@/components/UI/Form";
import {
  TableProperties,
  ChartNoAxesColumn,
  ListFilter,
  Users,
  Bolt,
} from "lucide-react";
import React, { useContext } from "react";
import FilterForm, { defaultFilter, filterTask } from "./FilterForm";
import MemberBoard from "./MemberBoard";
import ProjectSetting from "./ProjectSetting";
import { FilterContext, ProjectContext, ViewContext } from "../TaskTable";
import Menu from "@/components/UI/Menu";

export default function TaskControl() {
  const { project } = useContext(ProjectContext);
  const { filter, setFilter } = useContext(FilterContext);
  const { view, setView } = useContext(ViewContext);
  return (
    <div className="task-table-control z-4">
      <span
        className={`min-w-3 aspect-square  rounded-full   ${
          project?.state === 0
            ? " bg-yellow-300/50 outline-2 outline-yellow-300 "
            : project?.state === 1
            ? " bg-red-500/50 outline-2 outline-red-500"
            : " bg-green-500/50 outline-2 outline-green-500"
        }`}
      ></span>
      <div
        className={`font-mono  text-lg px-2  text-ellipsis overflow-hidden whitespace-nowrap 
        `}
      >
        {" "}
        {project?.name}
      </div>

      <div className="ml-auto flex flex-row gap-2 items-center justify-end">
        <button className="button-3" onClick={() => setView((prev) => !prev)}>
          {view ? <TableProperties /> : <ChartNoAxesColumn />}
        </button>
        <Menu
          name="Filter"
          icon={
            JSON.stringify(defaultFilter) === JSON.stringify(filter) ? (
              <button className=" button-3">
                <ListFilter />
              </button>
            ) : (
              <div className="flex flex-row items-center  bg-gray-500 rounded overflow-hidden cursor-pointer">
                <div className="p-1 items-center flex gap-2 hover:bg-black">
                  <ListFilter />
                  <div className="bg-white text-black text-sm  gap-1 flex items-center rounded-full px-2">
                    <span className="size-3 aspect-square rounded-full bg-blue-500"></span>
                    <span>
                      {
                        filterTask(
                          filter,
                          project?.list.flatMap((tl) => tl.list) || []
                        ).length
                      }
                    </span>
                  </div>
                </div>

                <button
                  className="hover:bg-black p-1 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setFilter(defaultFilter);
                  }}
                >
                  Clear
                </button>
              </div>
            )
          }
          menu={<FilterForm />}
        />

        <Form
          name={"Member board"}
          icon={
            <button className="button-2 gap-2">
              <Users size={18} />
              <span className="hidden sm:inline-block">Member</span>
            </button>
          }
          form={<MemberBoard />}
        />
        <Menu
          name={"Setting"}
          icon={
            <button className="button-2 gap-2">
              <Bolt size={18} />
              <span className="hidden sm:inline-block">Setting</span>
            </button>
          }
          menu={<ProjectSetting />}
        />
      </div>
    </div>
  );
}
