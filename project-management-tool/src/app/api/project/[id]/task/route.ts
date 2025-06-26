import { options } from "@/app/api/auth/[...nextauth]/option";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDatabase();
    const { id } = await params;
    const session = await getServerSession(options);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const { from, to, list } = await req.json();
    const userId = session.user._id;

    const project = await Project.findOne({ _id: id, member: userId });
    if (!project) {
      return NextResponse.json(
        { message: "Project not found or access denied" },
        { status: 404 }
      );
    }

    let movedTask = null;
    let sourceList = null;

    for (const l of project.list) {
      const task = l.list.find((t: any) => t._id.toString() === from);
      if (task) {
        movedTask = task.toObject();
        l.list = l.list.filter((t: any) => t._id.toString() !== from);
        sourceList = l;
        break;
      }
    }

    if (!movedTask) {
      return NextResponse.json(
        { message: "Task to move not found" },
        { status: 404 }
      );
    }

    const destinationList = project.list.find(
      (tl: any) => tl._id.toString() === list
    );
    if (!destinationList) {
      return NextResponse.json(
        { message: "Destination list not found" },
        { status: 404 }
      );
    }

    if (to) {
      const insertIndex = destinationList.list.findIndex(
        (t: any) => t._id.toString() === to
      );
      if (insertIndex === -1) {
        return NextResponse.json(
          { message: "Target position task not found" },
          { status: 404 }
        );
      }
      destinationList.list.splice(insertIndex, 0, movedTask);
    } else {
      destinationList.list.push(movedTask);
    }

    project.log.unshift({
      email: session.user.email,
      action: `move ${movedTask.name} from ${sourceList.name} to ${destinationList.name}`,
    });

    const newLog = project.log[0];

    await project.save();

    return NextResponse.json(
      { message: "Task moved successfully", log: newLog },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error moving task", error: error.message },
      { status: 500 }
    );
  }
};
