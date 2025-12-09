export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "@/lib/services/userService";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, oauth, image } = await request.json();

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // For non-OAuth registration, password is required
    if (!oauth && (!password || password.length < 6)) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password only for non-OAuth users
    let hashedPassword = null;
    if (password && !oauth) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    // Create user in database
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      image: image || "",
      provider: oauth ? "oauth" : "credentials",
      emailVerified: oauth ? true : false, // OAuth emails are pre-verified
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
