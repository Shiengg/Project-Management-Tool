import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/option";
import { upload } from "@/lib/cloudinary";

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
  { params }: { params: Promise<{ id: string }> }
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const params = await context.params;
    const userId = params.id;
    
    if (!userId || session.user._id !== userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { username, fullname, phoneNumber, image } = body;

    await connectToDatabase();

    // Check if email exists and is different from current user's email
    if (body.email) {
      const existingUser = await User.findOne({ 
        email: body.email,
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    // Upload image to cloudinary if provided
    let imageUrl = undefined;
    if (image && image !== session.user.image) {
      try {
        imageUrl = await upload(image, `user_${userId}`);
      } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        fullname,
        phoneNumber,
        ...(imageUrl && { image: imageUrl }),
      },
      { new: true }
    ).select("-password -notification");

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}