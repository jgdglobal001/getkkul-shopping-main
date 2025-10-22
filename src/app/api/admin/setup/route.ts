import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This is a development utility endpoint to set admin role
// In production, this should be secured or done through Firebase Admin Console
export async function POST(request: NextRequest) {
  try {
    const { email, secretKey } = await request.json();

    // Simple protection - in production use proper authentication
    if (secretKey !== "admin_setup_2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Update user role to admin
    await prisma.user.update({
      where: { email },
      data: {
        role: "admin",
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({
      message: `User ${email} has been promoted to admin`,
      success: true,
    });
  } catch (error) {
    console.error("Error setting admin role:", error);
    return NextResponse.json(
      { error: "Failed to set admin role" },
      { status: 500 }
    );
  }
}
