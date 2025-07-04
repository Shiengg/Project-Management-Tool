import { options } from "@/app/api/auth/[...nextauth]/option";
import TaskTable from "@/components/task/TaskTable/TaskTable";

import { getProject } from "@/services/projectService";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProjectPage({ params }: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const session = await getServerSession(options);
  const project = await getProject(id);

  // uncomment for member checking logic
  if (
    !session?.user._id ||
    !project?.member?.map((mb: any) => mb._id).includes(session.user._id)
  ) {
    redirect("/dashboard");
  }

  return (
    <div className="size-full">
      <TaskTable initProject={project} />
    </div>
  );
}
