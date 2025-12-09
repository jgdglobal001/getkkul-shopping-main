import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db, orders, orderItems, products } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user's orders from Drizzle
    const orderList = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt));

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orderList.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          orderItems: items,
          createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: order.updatedAt?.toISOString() || new Date().toISOString(),
        };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
