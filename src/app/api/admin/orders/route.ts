export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { hasPermission } from "@/lib/rbac/roles";
import { db, users, orders } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // TODO: Add proper authentication check
    // For now, assume admin access

    // Fetch all users
    const usersResult = await db.select().from(users).orderBy(desc(users.createdAt));

    // Fetch all orders with user info
    const ordersResult = await db
      .select({
        order: orders,
        userName: users.name,
        userEmail: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));

    // Group orders by user
    const userOrdersMap = new Map<string, any[]>();
    for (const { order, userName, userEmail } of ordersResult) {
      if (order.userId) {
        if (!userOrdersMap.has(order.userId)) {
          userOrdersMap.set(order.userId, []);
        }
        userOrdersMap.get(order.userId)!.push(order);
      }
    }

    const transformedUsers = usersResult.map((user) => ({
      id: user.id,
      name: user.name || "Unknown User",
      email: user.email || "",
      role: user.role || "user",
      createdAt: user.createdAt?.toISOString(),
      orders: userOrdersMap.get(user.id) || [],
    }));

    const transformedStandaloneOrders = ordersResult.map(({ order, userName, userEmail }) => ({
      id: order.id,
      ...order,
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
      customerName: userName || "Unknown User",
      customerEmail: userEmail || "",
    }));

    return NextResponse.json(
      {
        users: transformedUsers,
        standaloneOrders: transformedStandaloneOrders,
        totalUsers: transformedUsers.length,
        totalOrders: ordersResult.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // TODO: Add proper authentication and permission checks

    const body = await request.json();
    const { orderId, userId, updates, status, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Build updates object from individual fields or use provided updates
    const updateFields = updates || {};
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    // Try to update order
    try {
      const updatedOrders = await db.update(orders).set({
        ...updateFields,
        updatedAt: new Date(),
      }).where(eq(orders.id, orderId)).returning();

      if (updatedOrders.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        updated: "orders_table",
        order: updatedOrders[0]
      });
    } catch (orderError) {
      console.log("Order not found in orders table:", orderError);
    }

    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // TODO: Add proper authentication and permission checks

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Try to delete from orders table
    try {
      const deleted = await db.delete(orders).where(eq(orders.id, orderId)).returning();

      if (deleted.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        deleted: "orders_table",
      });
    } catch (orderError) {
      console.log("Order not found in orders table:", orderError);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
