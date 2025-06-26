import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/option";
import User from "@/models/User";
import Project from "@/models/Project";
import { connectToDatabase } from "@/lib/mongodb";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string; inviteId: string } }
) => {
  try {
    await connectToDatabase();
    const { id, inviteId } = await params;
    const session = await getServerSession(options);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user._id !== id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const state = await req.json();
    const user = await User.findById(id);
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const invitation = user.notification.id(inviteId);

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation not found" },
        { status: 404 }
      );
    }

    let message = "Invitation rejected";

    let newLog = null;

    if (state) {
      const project = await Project.findById(invitation.projectId);

      if (project) {
        const alreadyMember = project.member.some(
          (m: any) => m.toString() === session.user._id
        );

        if (!alreadyMember) {
          project.member.push(session.user._id);
          project.log.unshift({
            email: session.user.email,
            action: "joined the project",
          });

          newLog = project.log[0];
          await project.save();
        }

        message = "joined the project";
      } else {
        message = "Project no longer exists";
      }
    }

    user.notification = user.notification.filter(
      (n: any) => n._id.toString() !== inviteId
    );
    await user.save();

    return NextResponse.json({ message, log: newLog }, { status: 200 });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { message: "Error handling invitation", error: err.message },
      { status: 500 }
    );
  }
};
