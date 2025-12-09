export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { inArray } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    const { userIds } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid user IDs provided" },
        { status: 400 }
      );
    }

    // Delete users (cascade is handled by DB foreign keys)
    const deletedUsers = await db
      .delete(users)
      .where(inArray(users.id, userIds))
      .returning();

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
