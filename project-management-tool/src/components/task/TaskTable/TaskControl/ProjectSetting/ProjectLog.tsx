import React, { useContext } from "react";
import { ProjectContext } from "../../TaskTable";
import { formatDate } from "@/lib/format";

export default function ProjectLog() {
  const { project } = useContext(ProjectContext);
  return (
    <ul className=" flex flex-col overflow-auto gap-[2px] bg-gray-400">
      {project?.log
        ?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((log) => (
          <li key={log._id} className="flex flex-col p-1 bg-slate-800 gap-1">
            <div>
              <u>{log.email}</u>{" "}
              <span className="opacity-70">{log.action}</span>
            </div>
            <div className="text-right text-sm opacity-70">
              {formatDate(log.createdAt)}
            </div>
          </li>
        ))}
    </ul>
  );
}
