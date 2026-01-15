export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, orders, orderItems, partnerLinks } from "@/lib/db";
import { eq, sql } from "drizzle-orm";

// 커미션 계산 (15%)
function calculatePartnerCommission(productPrice: number): number {
  return Math.round(productPrice * 0.15);
}

/**
 * 토스페이먼츠 결제 취소 API
 * - 토스 결제 취소 요청
 * - 주문 상태 업데이트
 * - 파트너 커미션 회수
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId, cancelReason = "고객 요청에 의한 취소" } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "주문 ID가 필요합니다" },
        { status: 400 }
      );
    }

    console.log(`[OrderCancel] Processing cancel for orderId: ${orderId}`);

    // 1. 주문 조회
    const orderResult = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    const order = orderResult[0];

    if (!order) {
      return NextResponse.json(
        { success: false, error: "주문을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 이미 취소된 주문인지 확인
    if (order.status === "cancelled") {
      return NextResponse.json(
        { success: false, error: "이미 취소된 주문입니다" },
        { status: 400 }
      );
    }

    // 결제 완료된 주문만 취소 가능
    if (order.paymentStatus !== "paid") {
      return NextResponse.json(
        { success: false, error: "결제 완료된 주문만 취소할 수 있습니다" },
        { status: 400 }
      );
    }

    // 2. 토스페이먼츠 결제 취소 요청 (tossPaymentKey가 있는 경우)
    if (order.tossPaymentKey) {
      const secretKey = process.env.TOSS_SECRET_KEY;
      
      if (!secretKey) {
        console.error("[OrderCancel] TOSS_SECRET_KEY not configured");
        return NextResponse.json(
          { success: false, error: "결제 취소 설정 오류" },
          { status: 500 }
        );
      }

      console.log(`[OrderCancel] Calling Toss cancel API for paymentKey: ${order.tossPaymentKey}`);

      const tossResponse = await fetch(
        `https://api.tosspayments.com/v1/payments/${order.tossPaymentKey}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
          },
          body: JSON.stringify({
            cancelReason,
          }),
        }
      );

      const tossResult = await tossResponse.json();

      if (!tossResponse.ok) {
        console.error("[OrderCancel] Toss cancel failed:", tossResult);
        return NextResponse.json(
          { 
            success: false, 
            error: tossResult.message || "토스 결제 취소 실패",
            tossError: tossResult 
          },
          { status: 400 }
        );
      }

      console.log("[OrderCancel] Toss cancel success:", tossResult.status);
    }

    // 3. 주문 상태 업데이트
    await db.update(orders).set({
      status: "cancelled",
      paymentStatus: "refunded",
      updatedAt: new Date(),
    }).where(eq(orders.id, orderId));

    console.log(`[OrderCancel] Order status updated to cancelled`);

    // 4. 파트너 커미션 회수 (partnerLinkId가 있는 경우)
    if (order.partnerLinkId) {
      try {
        // 주문 아이템에서 총 상품 가격 계산
        const items = await db
          .select({ price: orderItems.price, quantity: orderItems.quantity })
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        const totalProductPrice = items.reduce(
          (sum, item) => sum + ((item.price || 0) * (item.quantity || 1)),
          0
        );

        const commission = calculatePartnerCommission(totalProductPrice);

        console.log(`[OrderCancel] Deducting partner commission: ₩${commission}`);

        // partner_links 테이블 업데이트
        await db
          .update(partnerLinks)
          .set({
            conversionCount: sql`GREATEST(${partnerLinks.conversionCount} - 1, 0)`,
            revenue: sql`GREATEST(${partnerLinks.revenue} - ${commission}, 0)`,
            updatedAt: new Date(),
          })
          .where(eq(partnerLinks.id, order.partnerLinkId));

        console.log(`[OrderCancel] Partner commission deducted successfully`);
      } catch (commissionError) {
        console.error("[OrderCancel] Failed to deduct commission:", commissionError);
        // 커미션 회수 실패해도 취소는 성공 처리
      }
    }

    return NextResponse.json({
      success: true,
      message: "주문이 성공적으로 취소되었습니다",
      orderId: order.orderId,
    });

  } catch (error) {
    console.error("[OrderCancel] Error:", error);
    return NextResponse.json(
      { success: false, error: "주문 취소 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

