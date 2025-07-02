import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/option";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import User from "@/models/User";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const userId = session.user._id;

    const project = await Project.findOne({
      $and: [{ _id: id }, { member: userId }],
    }).populate("member", "-notification -password");

    return NextResponse.json(project, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error fetching project",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectToDatabase();
    const { id } = await params;
    const session = await getServerSession(options);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.admin.toString() !== session.user._id) {
      return NextResponse.json(
        { message: "Only the admin can delete this project" },
        { status: 403 }
      );
    }

    const updates = await req.json();

    const oldValues: Record<string, any> = {};
    for (const key of Object.keys(updates)) {
      oldValues[key] = project[key];
      if (key === "admin") {
        const isMember = project.member.some(
          (memberId: any) => memberId.toString() === updates.admin
        );
        if (isMember) {
          project[key] = updates[key];
        }
        continue;
      }
      project[key] = updates[key];
    }

    const changeList = Object.keys(updates)
      .map((key) => {
        const oldVal = JSON.stringify(oldValues[key]);
        const newVal = JSON.stringify(project[key]);
        return `${key}: ${oldVal} → ${newVal}`;
      })
      .join(", ");

    project.log.unshift({
      email: session.user.email,
      action: "updated project information: " + changeList,
    });

    const newLog = project.log[0];


    await project.save();

    return NextResponse.json(
      { message: "Project updated", project, log: newLog },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error updating project",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectToDatabase();
    const { id } = await params;
    const session = await getServerSession(options);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.admin.toString() !== session.user._id) {
      return NextResponse.json(
        { message: "Only the admin can delete this project" },
        { status: 403 }
      );
    }

    await project.deleteOne();

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error deleting project",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
};
