import { options } from "@/app/api/auth/[...nextauth]/option";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDatabase();
    const { id } = await params;
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

    project.list.push({
      name,
      list: [],
    });

    project.log.unshift({
      email: session.user.email,
      action: `add task list ${name}`,
    });

    const newLog = project.log[0];

    await project.save();
    const addedList = project.list[project.list.length - 1];

    return NextResponse.json(
      {
        message: "Task list created",
        taskList: addedList,
        log: newLog,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error adding tasklist",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
};

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

    const { from, to } = await req.json();
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

    const list = project.list;

    // Find indexes
    const fromIndex = list.findIndex((l: any) => l._id.toString() === from);
    const toIndex = list.findIndex((l: any) => l._id.toString() === to);

    if (fromIndex === -1 || toIndex === -1) {
      return NextResponse.json(
        { message: "One or both task lists not found" },
        { status: 404 }
      );
    }

    const [movedList] = list.splice(fromIndex, 1);

    list.splice(toIndex, 0, movedList);

    project.log.unshift({
      email: session.user.email,
      action: `move ${movedList.name} to index ${toIndex + 1}`,
    });

    const newLog = project.log[0];

    project.list = list;

    await project.save();

    return NextResponse.json(
      {
        message: "Task lists reordered successfully",
        list: project.list,
        log: newLog,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error reordering task lists",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
};
