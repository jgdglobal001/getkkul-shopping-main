import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 임시로 관리자 권한 확인 생략 - 실제 운영에서는 권한 확인 필요
    // TODO: NextAuth v5 auth 함수로 권한 확인 구현

    // 최근 주문 5개 가져오기
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

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
      customerName: order.user?.name || order.customerEmail || "알 수 없음",
      amount: order.total,
      status: getKoreanStatus(order.status),
      createdAt: order.createdAt.toISOString()
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
