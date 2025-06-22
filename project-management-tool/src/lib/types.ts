import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id?: string;
    username?: string;
    fullname?: string;
    email?: string;
    phoneNumber?: string;
    image?: string;
  }

  interface Session {
    user: User;
  }
}

export type User = {
  id: string;
  username?: string;
  fullname?: string;
  email?: string;
  phoneNumber?: string;
  image?: string;
};

export type TaskList = {
  id: string;
  name?: string;
  list: Task[];
  createdAt?: Date | string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  admin: string;
  member: User[];
  list: TaskList[];
  state: 0 | 1 | 2;
  createdAt: Date | string;
  theme: string;
};

export type Task = {
  id: string;
  name: string;
  theme: string;
  description: string;
  member: string[];
  state: boolean;
  createdAt: Date | string;
  due: Date | string;
};

export type Notification = {
  id: string;
  projectId: string;
  projectName: string;
  email: string;
  createdAt: Date | string;
};
