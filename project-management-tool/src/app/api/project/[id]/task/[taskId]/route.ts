import { options } from "@/app/api/auth/[...nextauth]/option";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) => {
  try {
    await connectToDatabase();
    const { id, taskId } = await params;
    const session = await getServerSession(options);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const updates = await req.json();
    const userId = session.user._id;

    const project = await Project.findOne({ _id: id, member: userId });
    if (!project) {
      return NextResponse.json(
        { message: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const taskList = project.list.find((list: any) => list.list.id(taskId));

    if (!taskList) {
      return NextResponse.json(
        { message: "Task not found in any list" },
        { status: 404 }
      );
    }

    const task = taskList.list.find((t: any) => t._id.toString() === taskId);

    const oldValues: Record<string, any> = {};
    for (const key of Object.keys(updates)) {
      oldValues[key] = (task as any)[key];
    }
    const changeList = Object.keys(updates)
      .map((key) => {
        const oldVal = JSON.stringify(oldValues[key]);
        const newVal = JSON.stringify((updates as any)[key]);
        return `${key}: ${oldVal} → ${newVal}`;
      })
      .join(", ");

    project.log.unshift({
      email: session.user.email,
      action: ` update task ${task.name}: ${changeList}`,
    });

    const newLog = project.log[0];

    Object.assign(task, updates);

    await project.save();

    return NextResponse.json(
      { message: "Task updated", task, log: newLog },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating task", error: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) => {
  try {
    await connectToDatabase();
    const { id, taskId } = await params;
    const session = await getServerSession(options);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const userId = session.user._id;

    const project = await Project.findOne({ _id: id, member: userId });
    if (!project) {
      return NextResponse.json(
        { message: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const taskList = project.list.find((list: any) => list.list.id(taskId));

    if (!taskList) {
      return NextResponse.json(
        { message: "Task not found in any list" },
        { status: 404 }
      );
    }

    const target = taskList.list.find((t: any) => t._id.toString() === taskId);

    taskList.list = taskList.list.filter(
      (t: any) => t._id.toString() !== taskId
    );

    project.log.unshift({
      email: session.user.email,
      action: ` delete task: ${target.name}`,
    });

    const newLog = project.log[0];

    await project.save();

    return NextResponse.json(
      { message: "Task deleted successfully", log: newLog },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error deleting task", error: error.message },
      { status: 500 }
    );
  }
};
