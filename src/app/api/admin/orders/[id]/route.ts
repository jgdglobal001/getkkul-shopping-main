export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { hasPermission } from "@/lib/rbac/roles";
import { db, orders, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add proper authentication and permission checks

    const { id: orderId } = await params;
    const body = await request.json();
    const { updates } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Try to update order
    try {
      const updatedOrders = await db.update(orders).set({
        ...updates,
        updatedAt: new Date(),
      }).where(eq(orders.id, orderId)).returning();

      if (updatedOrders.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        updated: "orders_table",
        order: updatedOrders[0],
      });
    } catch (orderError) {
      console.log("Order not found in orders table:", orderError);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add proper authentication and permission checks

    const { id: orderId } = await params;

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
        orderId,
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add proper authentication and permission checks

    const { id: orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Try to get order from orders table
    try {
      const orderResult = await db
        .select({
          order: orders,
          userName: users.name,
          userEmail: users.email,
        })
        .from(orders)
        .leftJoin(users, eq(orders.userId, users.id))
        .where(eq(orders.id, orderId))
        .limit(1);

      if (orderResult.length > 0) {
        const { order, userName, userEmail } = orderResult[0];
        return NextResponse.json({
          order: {
            ...order,
            createdAt: order.createdAt?.toISOString(),
            updatedAt: order.updatedAt?.toISOString(),
          },
          customerName: userName || "Unknown User",
          customerEmail: userEmail || "",
          source: "orders_table",
        });
      }
    } catch (orderError) {
      console.log("Order not found in orders table:", orderError);
    }

    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
