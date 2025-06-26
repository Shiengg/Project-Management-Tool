import { options } from "@/app/api/auth/[...nextauth]/option";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
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

    if (session.user._id !== id) {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const user = await User.findById(id).populate({
      path: "notification.projectId",
      model: "Project",
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 403 }
      );
    }

    const notification = user.notification.map((n: any) => ({
      _id: n._id.toString(),
      projectId: n.projectId._id.toString(),
      projectName: n.projectId.name,
      email: n.email,
      createdAt: n.createdAt,
    }));

    return NextResponse.json(notification, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error fetching notification",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
};
