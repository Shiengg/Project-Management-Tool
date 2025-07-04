"use server";

import { cookies } from "next/headers";

export const createTask = async (
  projectId: string,
  listId: string,
  name: string
) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/project/${projectId}/tasklist/${listId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie.toString(),
        },
        body: JSON.stringify(name),
      }
    );

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const deleteTask = async (projectId: string, taskId: string) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/project/${projectId}/task/${taskId}`,
      {
        method: "DELETE",
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
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateTask = async (
  projectId: string,
  taskId: string,
  updates: any
) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/project/${projectId}/task/${taskId}`,
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
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const moveTask = async (
  projectId: string,
  from: string,
  list: string,
  to: string | null
) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/project/${projectId}/task/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie.toString(),
        },
        body: JSON.stringify({ from, to, list }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
