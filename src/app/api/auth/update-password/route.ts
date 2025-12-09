export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { hash, compare } from "bcryptjs";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest) {
  try {
    const { email, currentPassword, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    // Find user
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userResult[0];

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has existing password (for OAuth users setting first password)
    if (user.password && currentPassword) {
      // Verify current password for existing password users
      const isValidPassword = await compare(currentPassword, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 401 }
        );
      }
    } else if (user.password && !currentPassword) {
      // User has password but didn't provide current password
      return NextResponse.json(
        { success: false, error: "Current password is required" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 12);

    // Update password
    await db.update(users).set({
      password: hashedPassword,
      updatedAt: new Date(),
    }).where(eq(users.email, email));

    return NextResponse.json({
      success: true,
      message: user.password
        ? "Password updated successfully"
        : "Password set successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
