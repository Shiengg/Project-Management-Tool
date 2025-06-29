import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/option";
import bcrypt from "bcrypt";

export async function PATCH(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const params = await context.params;
        const { id } = params;

        const session = await getServerSession(options);

        if (!session?.user || session.user._id !== id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: "Current password and new password are required" },
                { status: 400 }
            );
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Current password is incorrect" },
                { status: 400 }
            );
        }

        // Update password - let the mongoose middleware handle hashing
        user.password = newPassword;
        await user.save();

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error changing password:", error);
        return NextResponse.json(
            {
                message: "Error changing password",
                error: error?.message || String(error),
            },
            { status: 500 }
        );
    }
} 