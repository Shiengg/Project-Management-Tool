import { options } from "@/app/api/auth/[...nextauth]/option";
import ProjectTable from "@/components/Project/ProjectTable/ProjectTable";
import { getServerSession } from "next-auth";
import React from "react";

export default async function Dashboard() {
  const session = await getServerSession(options);
  return (
    <div className="size-full">
      <ProjectTable id={session?.user.id || ""} />
    </div>
  );
}
