"use service";

import { createMockProject } from "./mock/mock";

export const InviteMember = async (projectId: string, ids: string[]) => {
  return true;
};

export const getProjects = async (userId: string) => {
  const projects = [];
  for (let i = 0; i < Math.random() * 10 + 3; i++) {
    projects.push(createMockProject("pj" + i, i));
  }
  return projects;
};

export const getProject = async (id:string) => {
  return createMockProject(id)
}