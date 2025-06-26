"use client";
import Form from "@/components/UI/Form";
import { Search, ListFilter, PanelsTopLeft } from "lucide-react";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import ProjectFilterForm, {
  defaultFilter,
  filterProject,
  ProjectFilterType,
} from "../ProjectFilterForm/ProjectFilterForm";
import ProjectForm from "../ProjectForm/ProjectForm";
import Menu from "@/components/UI/Menu";
import { Project } from "@/lib/types";
import Loader from "@/components/loader/Loader";
import ProjectCard from "../ProjectCard/ProjectCard";
import { createProject, getProjects } from "@/services/projectService";
import { toastError, toastSuccess } from "@/components/toast/toaster";

type FilterAndSortContextType = {
  filter: ProjectFilterType;
  setFilter: Dispatch<SetStateAction<ProjectFilterType>>;
};

export const FilterAndSortContext = createContext<FilterAndSortContextType>({
  filter: defaultFilter,
  setFilter: () => {},
});
export default function ProjectTable({ id }: { id: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<ProjectFilterType>(defaultFilter);
  const [isLoading, setIsLoading] = useState(false);
  const fetchProjects = async () => {
    setIsLoading(true);
    getProjects().then((res) => {
      setProjects(res), setTimeout(() => setIsLoading(false), 500);
    });
  };
  useEffect(() => {
    fetchProjects();
  }, [id]);

  const AddProject = async (
    name: string,
    description: string,
    projectTheme: string
  ) => {
    createProject(name, description, projectTheme).then((res) => {
      if (res) {
        toastSuccess("Project created");
        setProjects((prev) => [res, ...prev] as Project[]);
      } else {
        toastError("Failed to create project");
      }
    });
  };

  return (
    <FilterAndSortContext.Provider value={{ filter, setFilter }}>
      <div className="flex flex-col gap-4 p-2 items-center size-full py-10 ">
        <div className="max-w-[800px] w-full items-center flex flex-wrap p-2 gap-2 panel-1 z-2">
          <Search size={24} />

          <input
            type="text"
            className="input-box grow"
            placeholder="Search"
            value={filter.keyword}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, keyword: e.target.value }))
            }
          />
          <div className="flex flex-row gap-2 items-center ml-auto">
            <Menu
              name="Filter"
              icon={
                JSON.stringify(defaultFilter) === JSON.stringify(filter) ? (
                  <button className=" button-4">
                    <ListFilter />
                  </button>
                ) : (
                  <div className="flex flex-row items-center  bg-gray-500 rounded overflow-hidden cursor-pointer">
                    <div className="p-1 items-center flex gap-2 hover:bg-black">
                      <ListFilter />
                      <div className="bg-white text-black text-sm  gap-1 flex items-center rounded-full px-2">
                        <span className="size-3 aspect-square rounded-full bg-blue-500"></span>
                        <span>{filterProject(filter, projects).length}</span>
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
              menu={<ProjectFilterForm />}
            />

            <Form
              name="Create Project"
              icon={
                <button className="button-3 ">
                  <PanelsTopLeft size={20} />
                  Create Project
                </button>
              }
              form={<ProjectForm onCreate={AddProject} />}
            />
          </div>
        </div>

        <ul className="flex flex-wrap gap-2 items-start justify-center z-1 max-w-[800px]">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {filterProject(filter, projects)?.map((pj) => (
                <ProjectCard key={pj._id} project={pj} />
              ))}
            </>
          )}
        </ul>
      </div>
    </FilterAndSortContext.Provider>
  );
}
