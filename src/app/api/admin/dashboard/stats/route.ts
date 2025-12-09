export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, users, orders, products } from "@/lib/db";
import { eq, count, sql, or, gte, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // 蹂묐젹濡?紐⑤뱺 ?듦퀎 ?곗씠??媛?몄삤湲?
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
      // 珥??ъ슜????
      db.select({ count: count() }).from(users),

      // 珥?二쇰Ц ??
      db.select({ count: count() }).from(orders),

      // 珥??곹뭹 ??
      db.select({ count: count() }).from(products),

      // 泥섎━ ?湲?二쇰Ц
      db.select({ count: count() }).from(orders).where(
        or(eq(orders.status, "pending"), eq(orders.status, "processing"))
      ),

      // ?꾨즺??二쇰Ц
      db.select({ count: count() }).from(orders).where(eq(orders.status, "completed")),

      // ?ㅻ뒛 二쇰Ц ??
      db.select({ count: count() }).from(orders).where(gte(orders.createdAt, today)),

      // ?대쾲 ??留ㅼ텧
      db.select({ total: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)` })
        .from(orders)
        .where(and(eq(orders.status, "completed"), gte(orders.createdAt, monthStart))),

      // 珥?留ㅼ텧
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
    console.error("愿由ъ옄 ?듦퀎 議고쉶 ?ㅻ쪟:", error);
    return NextResponse.json(
      { error: "?듦퀎 ?곗씠?곕? 媛?몄삤??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
      { status: 500 }
    );
  }
}
