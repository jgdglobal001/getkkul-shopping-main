import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const { userIds } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid user IDs provided" },
        { status: 400 }
      );
    }

    // Use Prisma transaction for bulk delete with cascade
    const deletedUsers = await prisma.$transaction(
      userIds.map((userId: string) =>
        prisma.user.delete({
          where: { id: userId }
        })
      )
    );

    return NextResponse.json({
      message: `Successfully deleted ${deletedUsers.length} users and their related data`,
      deletedCount: deletedUsers.length,
    });
  } catch (error) {
    console.error("Error deleting users:", error);
    return NextResponse.json(
      { error: "Failed to delete users" },
      { status: 500 }
    );
  }
}
