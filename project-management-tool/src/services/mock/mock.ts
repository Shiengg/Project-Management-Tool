import { theme } from "@/components/theme/ThemeManager";
import { Task, TaskList, Project, User } from "@/lib/types";

const mockUsers = [
  {
    id: `user_1`,
    username: `user1`,
    fullname: `User 1`,
    email: `user1@example.com`,
    phoneNumber: `+123456781`,
    image: `https://i.pravatar.cc/150?img=1`,
  },
  {
    id: `user_$2`,
    username: `user$2`,
    fullname: `User $2`,
    email: `user$2@example.com`,
    phoneNumber: `+12345678$2`,
    image: `https://i.pravatar.cc/150?img=$2`,
  },
];

function getRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function createMockUser(id: string): User {
  return {
    id: `user_${id}`,
    username: `user${id}`,
    fullname: `User ${id}`,
    email: `user${id}@example.com`,
    phoneNumber: `+12345678${id}`,
    image: `https://i.pravatar.cc/150?img=${id}`,
  };
}

function createMockTask(id: string): Task {
  const createdAt = getRandomDate(new Date(2023, 0, 1), new Date());
  const due = getRandomDate(
    createdAt,
    new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 30)
  );

  return {
    id: `task_${id}`,
    name: `Task ${id}`,
    theme: Math.random() > 0.5 ? "img-3" : "",
    description: `This is a mock task number ${id}`,
    member: mockUsers.filter(() => Math.random() < 0.5).map((m) => m.id),

    state: Math.random() > 0.5,
    createdAt,
    due,
  };
}

function createMockTaskList(id: string, taskCount = 3): TaskList {
  const tasks: Task[] = [];

  for (let i = 0; i < taskCount; i++) {
    tasks.push(createMockTask(id + i)); // ensures unique task IDs per list
  }

  return {
    id: `list_${id}`,
    name: `List ${id}`,
    list: tasks,
    createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
  };
}

function createMockProject(id: string, listCount = 2): Project {
  const lists: TaskList[] = [];
  for (let i = 0; i < listCount; i++) {
    lists.push(createMockTaskList(id + i)); // ensures unique task IDs per list
  }
  return {
    id,
    admin: mockUsers[0].id,
    name: "My New Project",
    description: "Mock Project Description",
    member: mockUsers,
    list: lists,
    state: Math.floor(Math.random() * 2.9) as 0 | 1 | 2,
    createdAt: new Date(),
    theme: theme.flatMap((ct) => ct.background.flatMap((bg) => bg))[
      Math.round(
        Math.random() *
          theme.flatMap((ct) => ct.background.flatMap((bg) => bg)).length -
          1
      )
    ],
  };
}

export {
  createMockUser,
  createMockTask,
  createMockTaskList,
  createMockProject,
};
