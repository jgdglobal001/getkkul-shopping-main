export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, users, orders, products } from "@/lib/db";
import { eq, count, sql, or, gte, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Î≥ëÎ†¨Î°?Î™®Îì† ?µÍ≥Ñ ?∞Ïù¥??Í∞Ä?∏Ïò§Í∏?
    const [
      userCount,
      orderCount,
      productCount,
      pendingCount,
      completedCount,
      todayCount,
      monthlyRevenueResult,
      totalRevenueResult
    ] = await Promise.all([
      // Ï¥??¨Ïö©????
      db.select({ count: count() }).from(users),

      // Ï¥?Ï£ºÎ¨∏ ??
      db.select({ count: count() }).from(orders),

      // Ï¥??ÅÌíà ??
      db.select({ count: count() }).from(products),

      // Ï≤òÎ¶¨ ?ÄÍ∏?Ï£ºÎ¨∏
      db.select({ count: count() }).from(orders).where(
        or(eq(orders.status, "pending"), eq(orders.status, "processing"))
      ),

      // ?ÑÎ£å??Ï£ºÎ¨∏
      db.select({ count: count() }).from(orders).where(eq(orders.status, "completed")),

      // ?§Îäò Ï£ºÎ¨∏ ??
      db.select({ count: count() }).from(orders).where(gte(orders.createdAt, today)),

      // ?¥Î≤à ??Îß§Ï∂ú
      db.select({ total: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)` })
        .from(orders)
        .where(and(eq(orders.status, "completed"), gte(orders.createdAt, monthStart))),

      // Ï¥?Îß§Ï∂ú
      db.select({ total: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)` })
        .from(orders)
        .where(eq(orders.status, "completed"))
    ]);

    const stats = {
      totalUsers: userCount[0]?.count || 0,
      totalOrders: orderCount[0]?.count || 0,
      totalProducts: productCount[0]?.count || 0,
      pendingOrders: pendingCount[0]?.count || 0,
      completedOrders: completedCount[0]?.count || 0,
      todayOrders: todayCount[0]?.count || 0,
      monthlyRevenue: monthlyRevenueResult[0]?.total || 0,
      totalRevenue: totalRevenueResult[0]?.total || 0
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error("Í¥ÄÎ¶¨Ïûê ?µÍ≥Ñ Ï°∞Ìöå ?§Î•ò:", error);
    return NextResponse.json(
      { error: "?µÍ≥Ñ ?∞Ïù¥?∞Î? Í∞Ä?∏Ïò§??Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§" },
      { status: 500 }
    );
  }
}
