import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 임시로 관리자 권한 확인 생략 - 실제 운영에서는 권한 확인 필요
    // TODO: NextAuth v5 auth 함수로 권한 확인 구현

    // 병렬로 모든 통계 데이터 가져오기
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      pendingOrders,
      completedOrders,
      todayOrders,
      monthlyRevenue,
      totalRevenue
    ] = await Promise.all([
      // 총 사용자 수
      prisma.user.count(),
      
      // 총 주문 수
      prisma.order.count(),
      
      // 총 상품 수 (임시로 설정, 실제 상품 테이블이 있다면 수정)
      Promise.resolve(156),
      
      // 처리 대기 주문
      prisma.order.count({
        where: {
          status: {
            in: ["pending", "processing"]
          }
        }
      }),
      
      // 완료된 주문
      prisma.order.count({
        where: {
          status: "completed"
        }
      }),
      
      // 오늘 주문 수
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      
      // 이번 달 매출
      prisma.order.aggregate({
        where: {
          status: "completed",
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: {
          totalAmount: true
        }
      }),
      
      // 총 매출
      prisma.order.aggregate({
        where: {
          status: "completed"
        },
        _sum: {
          totalAmount: true
        }
      })
    ]);

    const stats = {
      totalUsers,
      totalOrders,
      totalProducts,
      pendingOrders,
      completedOrders,
      todayOrders,
      monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
      totalRevenue: totalRevenue._sum.totalAmount || 0
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
