"use server";

import { cookies } from "next/headers";

export const createList = async (projectId: string, name: string) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/project/${projectId}/tasklist`,
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
export const deleteList = async (projectId: string, taskListId: string) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/project/${projectId}/tasklist/${taskListId}`,
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

export const updateList = async (
  projectId: string,
  taskListId: string,
  name: string
) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/project/${projectId}/tasklist/${taskListId}`,
      {
        method: "PATCH",
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

export const moveList = async (projectId: string, from: string, to: string) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/project/${projectId}/tasklist/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie.toString(),
        },
        body: JSON.stringify({ from, to }),
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
