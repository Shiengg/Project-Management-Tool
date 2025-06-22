import { formatDate, formatDateOnly } from "@/lib/format";
import { Project } from "@/lib/types";
import Link from "next/link";
import React from "react";

export default function ProjectCard({ project }: { project: Project }) {
  const stateMap = {
    0: "In-Progress",
    1: "Closed",
    2: "Completed",
  };
  return (
    <Link
      href={`/project/${project.id}`}
      className={`project-card hover:opacity-90 `}
    >
      <div
        className={`background-base background-${project.theme} w-full  h-[80px] relative`}
      >
        <span
          className={`absolute top-1 right-1 text-xs p-1 rounded ${
            project.state === 0
              ? " bg-yellow-800 text-yellow-300"
              : project.state === 1
              ? "text-red-300 bg-red-800"
              : "text-green-300 bg-green-800"
          }`}
        >
          {stateMap[project.state] ?? "Unknown"}
        </span>
        <div className="absolute right-1 bottom-1 panel-1 px-1 text-xs ">
          <span>{formatDateOnly(project.createdAt)}</span>
        </div>
      </div>
      <div className="flex flex-col py-1 px-2">
        <div className=" ">{project.name}</div>
      </div>
    </Link>
  );
}
