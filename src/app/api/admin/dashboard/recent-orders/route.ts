export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, orders, users } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // 최근 주문 5개 가져오기 (user 정보 포함)
    const recentOrders = await db
      .select({
        id: orders.id,
        totalAmount: orders.totalAmount,
        status: orders.status,
        createdAt: orders.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(5);

    // 주문이 없는 경우 더미 데이터 제공
    if (recentOrders.length === 0) {
      const dummyOrders = [
        {
          id: "dummy-1",
          orderId: "ORD-DEMO-001",
          customerName: "김철수 (데모)",
          amount: 89000,
          status: "배송중",
          createdAt: new Date().toISOString()
        },
        {
          id: "dummy-2",
          orderId: "ORD-DEMO-002",
          customerName: "이영희 (데모)",
          amount: 156000,
          status: "완료",
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "dummy-3",
          orderId: "ORD-DEMO-003",
          customerName: "박민수 (데모)",
          amount: 234000,
          status: "처리중",
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];

      return NextResponse.json(dummyOrders);
    }

    // 응답 형식에 맞게 변환
    const formattedOrders = recentOrders.map((order) => ({
      id: order.id,
      orderId: `ORD-${order.id.slice(-8).toUpperCase()}`,
      customerName: order.userName || order.userEmail || "알 수 없음",
      amount: order.totalAmount,
      status: getKoreanStatus(order.status || "pending"),
      createdAt: order.createdAt?.toISOString() || new Date().toISOString()
    }));

    return NextResponse.json(formattedOrders);

  } catch (error) {
    console.error("최근 주문 조회 오류:", error);
    return NextResponse.json(
      { error: "최근 주문 데이터를 가져오는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// 주문 상태를 한국어로 변환
function getKoreanStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    pending: "처리중",
    processing: "처리중", 
    shipped: "배송중",
    delivered: "완료",
    completed: "완료",
    cancelled: "취소",
    refunded: "환불"
  };
  
  return statusMap[status] || status;
}
