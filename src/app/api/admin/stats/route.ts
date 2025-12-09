export const runtime = 'edge';

import { NextResponse } from "next/server";
import { db, users, orders, products } from "@/lib/db";
import { eq, count, sql } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch real data from Drizzle
    const [
      userCount,
      orderCount,
      productCount,
      pendingCount,
      completedCount,
      revenueResult
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(orders),
      db.select({ count: count() }).from(products),
      db.select({ count: count() }).from(orders).where(eq(orders.status, "pending")),
      db.select({ count: count() }).from(orders).where(eq(orders.status, "completed")),
      db.select({ total: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)` })
        .from(orders)
        .where(eq(orders.status, "completed")),
    ]);

    const stats = {
      totalUsers: userCount[0]?.count || 0,
      totalOrders: orderCount[0]?.count || 0,
      totalRevenue: revenueResult[0]?.total || 0,
      totalProducts: productCount[0]?.count || 0,
      pendingOrders: pendingCount[0]?.count || 0,
      completedOrders: completedCount[0]?.count || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
