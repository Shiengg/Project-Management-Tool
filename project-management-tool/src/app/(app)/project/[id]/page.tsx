
import { options } from "@/app/api/auth/[...nextauth]/option";
import TaskTable from "@/components/task/TaskTable/TaskTable";

import { getProject } from "@/services/projectService";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Project({ params }: { params: { id: string } }) {

  const {id} = await params
  const session = await getServerSession(options)
  const project = await getProject(id);

  // if(!session?.user.id || !project.member?.map(mb=>mb.id).includes(session.user.id)) {
  //   redirect("/dashboard")
  // }

  return (
    <div className="size-full">
      <TaskTable initProject={project} />
    </div>
  );
}
