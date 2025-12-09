export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, users, orders } from "@/lib/db";
import { eq, count, sql } from "drizzle-orm";
import { USER_ROLES } from "@/lib/rbac/permissions";

export async function GET(request: NextRequest) {
  try {
    // Fetch real users from Drizzle
    const userList = await db.select().from(users);

    // Get order counts for each user
    const orderCounts = await db
      .select({
        userId: orders.userId,
        count: count(),
        totalSpent: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)`,
      })
      .from(orders)
      .groupBy(orders.userId);

    const orderCountMap = new Map(
      orderCounts.map((o) => [o.userId, { count: o.count, totalSpent: o.totalSpent }])
    );

    // Transform data to match expected format
    const transformedUsers = userList.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
      orders: orderCountMap.get(user.id)?.count || 0,
      totalSpent: orderCountMap.get(user.id)?.totalSpent || 0,
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, name, email, role } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role !== undefined) {
      const validRoles = Object.values(USER_ROLES);
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: `Invalid role. Valid roles are: ${validRoles.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;

    // Update user in Drizzle
    await db.update(users).set(updateData).where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      message: `User updated successfully${role ? ` with role: ${role}` : ""}`,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
