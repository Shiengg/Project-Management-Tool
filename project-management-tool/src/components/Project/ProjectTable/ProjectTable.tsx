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
import { Input } from "@/components/UI/input";

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
          <div className="relative group grow">
            <Input
              id="search"
              type="text"
              name="search"
              value={filter.keyword}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, keyword: e.target.value }))
              }
              placeholder="Search"
              className="  pl-10 h-10 sm:h-12 w-full text-sm sm:text-base rounded-lg border-2 border-white/20 bg-black/20 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder:text-gray-300"
              maxLength={30}
              required
            />
            <Search className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-white/70 group-hover:text-blue-300 transition-colors duration-200" />
          </div>

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
