export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { hasPermission } from "@/lib/rbac/roles";
import { db, orders } from "@/lib/db";
import { inArray } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    // TODO: Add proper authentication and permission checks

    const { orderIds } = await request.json();

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: "Order IDs array required" },
        { status: 400 }
      );
    }

    // Delete orders
    const deletedOrders = await db
      .delete(orders)
      .where(inArray(orders.id, orderIds))
      .returning();

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedOrders.length} orders`,
      deletedCount: deletedOrders.length,
    });
  } catch (error) {
    console.error("Error bulk deleting orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
