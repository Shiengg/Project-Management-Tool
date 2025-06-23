import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await connectToDatabase();
    try {
        const body = await request.json();
        const { email, password, fullname, phoneNumber, username } = body;
        if (!email || !password || !username) {
            return NextResponse.json({ message: 'Email, username and password are required' }, { status: 400 });
        }
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
        }
        // Create user
        const user = await User.create({ email, password, fullname, phoneNumber, username });
        const userObj = user.toObject();
        Reflect.deleteProperty(userObj, 'password');
        return NextResponse.json(userObj, { status: 201 });
    } catch (error: any) {
        console.error("[API /api/user] Error creating user:", error, error?.message, error?.stack);
        return NextResponse.json({ message: 'Error creating user', error: error?.message || String(error) }, { status: 500 });
    }
}
