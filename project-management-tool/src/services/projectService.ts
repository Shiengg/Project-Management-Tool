"use server";

import { cookies } from "next/headers";
import { createMockProject } from "./mock/mock";

export const InviteMember = async (projectId: string, ids: string[]) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/project/${projectId}/member`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie.toString(),
        },
        body: JSON.stringify(ids),
      }
    );

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      return data.results;
    } else {
      return [];
    }
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};

export const RemoveMember = async (projectId: string, id: string) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/project/${projectId}/member`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie.toString(),
        },
        body: JSON.stringify(id),
      }
    );

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return null;
    }
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const createProject = async (
  name: string,
  description: string,
  theme: string
) => {
  try {
    const cookie = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie.toString(),
      },
      body: JSON.stringify({ name, description, theme }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.project;
    } else {
      return null;
    }
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/project/${projectId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie.toString(),
        },
      }
    );

    if (res.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};

export const getProjects = async () => {
  try {
    const cookie = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/project`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie.toString(),
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return [];
    }
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};

export const getProject = async (id: string) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/project/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie.toString(),
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return null;
    }
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const updateProject = async (id: string, updates: any) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/project/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie.toString(),
        },
        body: JSON.stringify(updates),
      }
    );

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return null;
    }
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
