import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/option";
import User from "@/models/User";
import Project from "@/models/Project";
import { connectToDatabase } from "@/lib/mongodb";

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDatabase();
    const session = await getServerSession(options);
    if (!session?.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const ids: string[] = await req.json();

    const project = await Project.findById(id);
    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );

    if (!project.member.some((m: any) => m.toString() === session.user._id)) {
      return NextResponse.json(
        { message: "Only members can invite users" },
        { status: 403 }
      );
    }

    const results: {
      userId: string;
      _id: string;
    }[] = [];

    for (const i of ids) {
      const user = await User.findById(i);
      if (!user) {
        continue;
      }

      let invitation;
      const existing = user.notification?.find(
        (n: any) => n.projectId.toString() === id
      );

      if (existing) {
        existing.createdAt = new Date();
        invitation = existing;
        results.push({
          userId: i,
          _id: invitation._id.toString(),
        });
      } else {
        user.notification.unshift({ projectId: id, email: session.user.email });
        invitation = user.notification[0];
        results.push({
          userId: i,
          _id: invitation._id.toString(),
        });
      }

      await user.save();
    }

    return NextResponse.json(
      { message: "Invitations processed", results },
      { status: 201 }
    );
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { message: "Error inviting users", error: err.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } } // project ID
) => {
  try {
    await connectToDatabase();
    const { id } = await params;
    const session = await getServerSession(options);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = await req.json(); // ID of user to remove
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (
      userId !== session.user._id &&
      project.admin.toString() !== session.user._id
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (project.admin.toString() === userId) {
      return NextResponse.json(
        { message: "Can't remove admin" },
        { status: 403 }
      );
    }

    project.member = project.member.filter(
      (id: any) => id.toString() !== userId
    );
    project.log.unshift({
      email: user.email,
      action: "removed from the project",
    });

    const newLog = project.log[0];

    await project.save();

    return NextResponse.json(
      { message: "User removed from project", log: newLog },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: "Error removing user", error: err.message },
      { status: 500 }
    );
  }
};
