"use client";

import React, { useState } from "react";
import { Project } from "@/lib/types";
import { createMockProject } from "@/services/mock/mock";
import { toastSuccess } from "@/components/toast/toaster";
import { useSession } from "next-auth/react";
import { theme } from "@/components/theme/ThemeManager";
import { createProject } from "@/services/projectService";
import Loader from "@/components/loader/Loader";

export default function ProjectForm({ onCreate }: { onCreate: any }) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [projectTheme, setProjectTheme] = useState("1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onCreate(name, description, projectTheme);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4 bg-gray-900 p-2 rounded-lg"
    >

      <div className="flex flex-col gap-1">
        <label className="text-gray-300">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-box"
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="input-box"
          placeholder="Brief description"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-300 flex flex-row gap-2 items-center">
          Project Theme{" "}
          <div
            className={`aspect-[2/1] w-9 rounded background-base background-${projectTheme}`}
          ></div>
        </label>

        <ul className="flex flex-col gap-2 p-1 panel-1 ">
          {theme.map((category) => (
            <div key={category.name} className="pb-4">
              <h2 className=" font-semibold mb-2">{category.name}</h2>
              <div className="flex flex-wrap gap-3">
                {category.background.map((bg) => (
                  <button
                    type="button"
                    onClick={() => setProjectTheme(bg)}
                    key={bg}
                    className={`rounded-lg aspect-[2/1] max-w-[50px] grow min-w-[50px]  shadow-md background-base  background-${bg} cursor-pointer ${
                      projectTheme === bg ? "outline-2 outline-gray-500" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </ul>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="button-3 self-start w-full"
      >
        {isLoading ? <Loader /> : "Create Project"}
      </button>
    </form>
  );
}
