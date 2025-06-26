"use server";

import { cookies, headers } from "next/headers";

export const getNotification = async (id: string) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/${id}/invitation`,
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
      return [];
    }
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};

export const handleNotification = async (
  id: string,
  notificationId: string,
  state: boolean
) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/${id}/invitation/${notificationId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie.toString(),
        },
        body: JSON.stringify(state),
      }
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.log(error.message);
  }
};
