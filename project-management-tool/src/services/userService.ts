"use server";
import { cookies } from "next/headers";

export const searchUser = async (keyword: string) => {
  try {
    const cookie = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/user?keyword=${keyword}`,
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
  } catch (error) {
    console.log(error);
    return [];
  }
};
