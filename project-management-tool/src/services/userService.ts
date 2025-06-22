"use server";
import { User } from "@/lib/types";
import { createMockUser } from "./mock/mock";

export const searchUser = async (email: string): Promise<User[]> => {
  const results: User[] = [];

  const count = Math.floor(Math.random() * 5) + 1; // random number between 1 and 5

  for (let i = 0; i < count; i++) {
    results.push(createMockUser(`${email}+${i}`));
  }

  return results;
};
