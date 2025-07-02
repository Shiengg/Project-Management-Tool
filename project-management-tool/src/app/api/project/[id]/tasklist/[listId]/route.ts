import { options } from "@/app/api/auth/[...nextauth]/option";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,

  { params }: { params: Promise<{ id: string; listId: string }> }
) => {
  try {
    await connectToDatabase();
    const { id, listId } = await params;

    const session = await getServerSession(options);

    if (!session?.user) {
      return NextResponse.json(
        {
          message: "Unauthorized user",
          error: "Unauthorized user",
        },
        { status: 401 }
      );
    }

    const name = await req.json();

    const userId = session.user._id;
    const project = await Project.findOne({
      $and: [{ _id: id }, { member: userId }],
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const taskList = project.list.find(
      (tl: any) => tl._id.toString() === listId
    );

    if (!taskList) {
      return NextResponse.json(
        { message: "Task list not found" },
        { status: 404 }
      );
    }

    const newTask = {
      name,
    };

    taskList.list.push(newTask);

    project.log.unshift({
      email: session.user.email,
      action: `add task:${name} to ${taskList.name}`,
    });
    const newLog = project.log[0];
    await project.save();
    const addedTask = taskList.list[taskList.list.length - 1];
    return NextResponse.json(
      {
        message: "Task created",
        task: addedTask,
        log: newLog,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error adding task",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: NextRequest,

  { params }: { params: Promise<{ id: string; listId: string }> }
) => {
  try {
    await connectToDatabase();
    const { id, listId } = await params;

    const session = await getServerSession(options);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const name = await req.json();
    const userId = session.user._id;

    const project = await Project.findOne({
      _id: id,
      member: userId,
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const taskList = project.list.id(listId);

    if (!taskList) {
      return NextResponse.json(
        { message: "Task list not found" },
        { status: 404 }
      );
    }
    const old = taskList.name;

    taskList.name = name;

    project.log.unshift({
      email: session.user.email,
      action: `update ${old} task list to ${name}`,
    });

    const newLog = project.log[0];
    await project.save();

    return NextResponse.json(
      {
        message: "Task list name updated",
        taskList,
        log: newLog,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error updating task list",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,

  { params }: { params: Promise<{ id: string; listId: string }> }
) => {
  try {
    await connectToDatabase();
    const { id, listId } = await params;
    const session = await getServerSession(options);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const userId = session.user._id;

    const project = await Project.findOne({
      _id: id,
      member: userId,
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const target = project.list.find((tl: any) => tl._id.toString() === listId);

    project.list = project.list.filter(
      (tl: any) => tl._id.toString() !== listId
    );
    project.log.unshift({
      email: session.user.email,
      action: `delete ${target.name} task list from the project`,
    });
    const newLog = project.log[0];
    await project.save();

    return NextResponse.json(
      {
        message: "Task list removed successfully",
        log:newLog,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error removing task list",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
};
