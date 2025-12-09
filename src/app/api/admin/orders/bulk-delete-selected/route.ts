export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, orders } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    // TODO: Add proper authentication and permission checks

    const { orderIds } = await request.json();

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: "Order IDs array is required" },
        { status: 400 }
      );
    }

    const results = {
      deleted: [] as string[],
      notFound: [] as string[],
      errors: [] as { orderId: string; error: string }[],
    };

    for (const orderId of orderIds) {
      try {
        // Try to delete from orders table
        const deleted = await db.delete(orders).where(eq(orders.id, orderId)).returning();

        if (deleted.length > 0) {
          results.deleted.push(orderId);
        } else {
          results.notFound.push(orderId);
        }
      } catch (error) {
        console.error(`Error deleting order ${orderId}:`, error);
        results.errors.push({
          orderId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${results.deleted.length} orders successfully`,
      results,
    });
  } catch (error) {
    console.error("Error in bulk delete selected orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
