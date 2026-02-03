export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, orders } from "@/lib/db";
import { inArray } from "drizzle-orm";
import { auth } from "../../../../../../auth";

export async function DELETE(request: NextRequest) {
  try {
    // 사용자 인증 확인
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const { orderIds } = await request.json();

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: "Order IDs array required", success: false },
        { status: 400 }
      );
    }

    // 먼저 삭제하려는 주문들의 상태를 확인
    const ordersToCheck = await db.query.orders.findMany({
      where: inArray(orders.id, orderIds),
    });

    // 삭제 가능한 주문만 필터링 (pending 또는 cancelled 상태)
    const deletableOrderIds = ordersToCheck
      .filter((order) => {
        const status = (order.status || '').toLowerCase();
        const paymentStatus = (order.paymentStatus || '').toLowerCase();
        // pending 상태이거나 cancelled 상태인 경우만 삭제 가능
        return status === 'cancelled' || paymentStatus === 'pending';
      })
      .map((order) => order.id);

    // 삭제 불가능한 주문이 있으면 알림
    const nonDeletableCount = orderIds.length - deletableOrderIds.length;
    if (nonDeletableCount > 0 && deletableOrderIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: "선택한 주문은 삭제할 수 없습니다. (결제 완료된 주문은 취소 후 삭제 가능)",
        nonDeletableCount,
      }, { status: 400 });
    }

    if (deletableOrderIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "삭제할 주문이 없습니다",
        deletedCount: 0,
      });
    }

    // 삭제 가능한 주문만 삭제
    const deletedOrders = await db
      .delete(orders)
      .where(inArray(orders.id, deletableOrderIds))
      .returning();

    return NextResponse.json({
      success: true,
      message: `${deletedOrders.length}개 주문이 삭제되었습니다`,
      deletedCount: deletedOrders.length,
      skippedCount: nonDeletableCount,
    });
  } catch (error) {
    console.error("Error bulk deleting orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
