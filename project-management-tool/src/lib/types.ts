import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    phoneNumber: string;
    image: string;
    createdAt: Date | string;
  }

  interface Session {
    user: User;
  }
}

export type User = {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  image: string;
  notification?: Notification[];
  createdAt: Date | string;
};

export type TaskList = {
  _id: string;
  name?: string;
  list: Task[];
  createdAt?: Date | string;
};

export type Project = {
  _id: string;
  name: string;
  description: string;
  admin: string;
  member: User[];
  list: TaskList[];
  state: 0 | 1 | 2;
  createdAt: Date | string;
  theme: string;
  log: Log[];
};

export type Log = {
  _id: string;
  email: string;
  action: string;
  createdAt: Date | string;
};

export type Task = {
  _id: string;
  name: string;
  theme: string;
  description: string;
  member: string[];
  status: boolean;
  priority: 1 | 2 | 3 | 4 | 5;
  createdAt: Date | string;
  due: Date | string;
};

export type Invitation = {
  _id: string;
  projectId: string;
  projectName: string;
  email: string;
  createdAt: Date | string;
};
