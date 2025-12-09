export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, orders } from "@/lib/db";
import { eq, or } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const {
      orderId,
      email,
      paymentStatus = "paid",
      status,
    } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find the order by orderId
    const orderResult = await db
      .select()
      .from(orders)
      .where(or(eq(orders.id, orderId), eq(orders.orderId, orderId)))
      .limit(1);
    const order = orderResult[0];

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If email is provided, verify it matches the order's user email
    if (email && order.userEmail !== email) {
      return NextResponse.json({ error: "Order not found for this email" }, { status: 404 });
    }

    // Update the order
    const updateData: any = {
      paymentStatus: paymentStatus,
      updatedAt: new Date(),
    };
    if (status) updateData.status = status;

    const updatedOrders = await db.update(orders).set(updateData).where(eq(orders.id, order.id)).returning();

    return NextResponse.json({
      message: "Order updated successfully",
      success: true,
      order: updatedOrders[0],
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
