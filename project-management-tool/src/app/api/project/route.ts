import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/option";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();

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

    const { name, description, theme } = await req.json();

    const newProject = new Project({
      name,
      description,
      admin: session.user._id,
      member: [session.user._id],
      list: [],
      state: 0,
      theme,
      log: [],
    });

    newProject.log.unshift({
      email: session.user.email,
      action: "created the project",
    });

    await newProject.save();

    return NextResponse.json(
      {
        message: "Project created successfully",
        project: newProject,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error creating project",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const session = await getServerSession(options);

    if (!session?.user) {
      return NextResponse.json(
        {
          message: "Unauthorized user",
        },
        { status: 401 }
      );
    }

    const userId = session.user._id;

    const projects = await Project.find({ member: userId })
      .populate("member", "-notification -password") // optionally populate members
      .sort({ updatedAt: -1 }); // newest first

    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error fetching projects",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
};
