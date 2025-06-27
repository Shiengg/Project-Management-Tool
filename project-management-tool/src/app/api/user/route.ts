import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/option";

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
      image:"",
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

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(options);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");

    if (!keyword) {
      return NextResponse.json([], { status: 200 });
    }

    // Perform case-insensitive search on username, fullname, or email
    const users = await User.find({
      $or: [
        { username: { $regex: keyword, $options: "i" } },
        { fullname: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    })
      .select("_id fullname email image username createdAt") // Return only safe public fields
      .limit(30); // Optional: limit results

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error searching users",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
