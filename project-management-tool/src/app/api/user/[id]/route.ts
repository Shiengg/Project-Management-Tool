import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/option";

export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();
    const { email, password, fullname, phoneNumber, username } = body;
    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "Email, username and password are required" },
        { status: 400 }
      );
    }
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }
    // Create user
    const user = await User.create({
      email,
      password,
      fullname,
      phoneNumber,
      username,
    });
    const userObj = user.toObject();
    Reflect.deleteProperty(userObj, "password");
    return NextResponse.json(userObj, { status: 201 });
  } catch (error: any) {
    console.error(
      "[API /api/user] Error creating user:",
      error,
      error?.message,
      error?.stack
    );
    return NextResponse.json(
      {
        message: "Error creating user",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = await params;
  try {
    const body = await request.json();
    const session = await getServerSession(options);

    if (!session?.user || session.user._id !== id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { fullname, phoneNumber, username } = body;

    // Create user
    const user = await User.findByIdAndUpdate(
      id,
      {
        fullname,
        phoneNumber,
        username,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error updating user",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
