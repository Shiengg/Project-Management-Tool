import { theme } from "@/components/theme/ThemeManager";
import { Task, TaskList, Project, User, Log } from "@/lib/types";

const mockUsers = [
  {
    _id: `user_1`,
    username: `user1`,
    fullname: `User 1`,
    email: `user1@example.com`,
    phoneNumber: `+123456781`,
    image: `https://i.pravatar.cc/150?img=1`,
    createdAt: new Date(),
  },
  {
    _id: `user_$2`,
    username: `user$2`,
    fullname: `User $2`,
    email: `user$2@example.com`,
    phoneNumber: `+12345678$2`,
    image: `https://i.pravatar.cc/150?img=$2`,
    createdAt: new Date(),
  },
];

function getRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function createMockUser(id: string): User {
  return {
    _id: `user_${id}`,
    username: `user${id}`,
    fullname: `User ${id}`,
    email: `user${id}@example.com`,
    phoneNumber: `+12345678${id}`,
    image: `https://i.pravatar.cc/150?img=${id}`,
    createdAt: new Date(),
  };
}

function createMockTask(id: string): Task {
  const createdAt = getRandomDate(new Date(2023, 0, 1), new Date());
  const due = getRandomDate(
    createdAt,
    new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 30)
  );

  return {
    _id: `task_${id}`,
    name: `Task ${id}`,
    theme: Math.random() > 0.5 ? "img-3" : "",
    description: `This is a mock task number ${id}`,
    member: mockUsers.filter(() => Math.random() < 0.5).map((m) => m._id),
    priority: Math.round(Math.random() * 5) as 1 | 2 | 3 | 4 | 5,
    status: Math.random() > 0.5,
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
    _id: `list_${id}`,
    name: `List ${id}`,
    list: tasks,
    createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
  };
}

function createMockLogs(num = 10): Log[] {
  const actions = ["joined", "left", "create", "update", "delete"];
  const logs: Log[] = [];

  for (let i = 0; i < num; i++) {
    logs.push({
      _id: `log_${i}_${Math.random().toString(36).substring(2, 10)}`,
      email: `user${i}@example.com`,
      action: actions[Math.floor(Math.random() * actions.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)), // random past date
    });
  }

  return logs;
}

function createMockProject(id: string, listCount = 2): Project {
  const lists: TaskList[] = [];
  for (let i = 0; i < listCount; i++) {
    lists.push(createMockTaskList(id + i)); // ensures unique task IDs per list
  }
  return {
    _id: id,
    admin: mockUsers[0]._id,
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
    log: createMockLogs(Math.round(Math.random() * 10)),
  };
}

export {
  createMockUser,
  createMockTask,
  createMockTaskList,
  createMockProject,
};
