export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, users, orders, products } from "@/lib/db";
import { eq, count, sql, or, gte, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // 병렬로 모든 통계 데이터 가져오기
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
      // 총 사용자 수
      db.select({ count: count() }).from(users),

      // 총 주문 수
      db.select({ count: count() }).from(orders),

      // 총 상품 수
      db.select({ count: count() }).from(products),

      // 처리 대기 주문
      db.select({ count: count() }).from(orders).where(
        or(eq(orders.status, "pending"), eq(orders.status, "processing"))
      ),

      // 완료된 주문
      db.select({ count: count() }).from(orders).where(eq(orders.status, "completed")),

      // 오늘 주문 수
      db.select({ count: count() }).from(orders).where(gte(orders.createdAt, today)),

      // 이번 달 매출
      db.select({ total: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)` })
        .from(orders)
        .where(and(eq(orders.status, "completed"), gte(orders.createdAt, monthStart))),

      // 총 매출
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
    console.error("관리자 통계 조회 오류:", error);
    return NextResponse.json(
      { error: "통계 데이터를 가져오는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
