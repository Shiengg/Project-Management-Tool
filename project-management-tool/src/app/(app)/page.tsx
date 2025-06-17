"use client";
import TaskListComponent from "@/components/task/TaskList/TaskList";
import TaskList from "@/components/task/TaskList/TaskList";
import TaskTable from "@/components/task/TaskTable";
import { createMockTaskList } from "@/services/mock/mock";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="size-full">
      <TaskTable id={"mock"}/>
    </div>
  );
}
