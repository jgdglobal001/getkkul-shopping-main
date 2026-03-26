export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, users, orders, orderItems, partnerLinks } from "@/lib/db";
import { and, eq, ne, sql } from "drizzle-orm";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
} from "@/lib/orderStatus";
import { calculatePartnerCommission } from "@/lib/partnerCommission";
import {
  amountsMatch,
  buildTossBasicAuthHeader,
  normalizeTossAmount,
} from "@/lib/tossPaymentValidation";

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentKey, amount, userEmail } = await request.json();
    const normalizedRequestedAmount = normalizeTossAmount(amount);

    if (!orderId || !paymentKey || normalizedRequestedAmount === null || !userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: orderId, paymentKey, amount, userEmail",
        },
        { status: 400 }
      );
    }

    const secretKey = process.env.TOSS_WIDGET_SECRET_KEY;

    if (!secretKey) {
      console.error("Toss API keys not configured");
      return NextResponse.json(
        { success: false, error: "Toss API keys not configured" },
        { status: 500 }
      );
    }

    const userResult = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    const user = userResult[0];

    if (!user) {
      return NextResponse.json(
        { success: false, error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    const existingOrderResult = await db.select().from(orders).where(eq(orders.orderId, orderId)).limit(1);
    const existingOrder = existingOrderResult[0];

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: "주문 정보를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    if (existingOrder.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "주문 소유자가 일치하지 않습니다" },
        { status: 403 }
      );
    }

    const expectedAmount = normalizeTossAmount(existingOrder.totalAmount);

    if (expectedAmount === null) {
      return NextResponse.json(
        { success: false, error: "주문 금액 정보가 올바르지 않습니다" },
        { status: 500 }
      );
    }

    if (expectedAmount !== normalizedRequestedAmount) {
      return NextResponse.json(
        { success: false, error: "주문 금액 검증에 실패했습니다" },
        { status: 400 }
      );
    }

    if (existingOrder.paymentStatus === PAYMENT_STATUSES.PAID) {
      if (existingOrder.tossPaymentKey && existingOrder.tossPaymentKey !== paymentKey) {
        return NextResponse.json(
          { success: false, error: "이미 다른 결제 정보로 승인된 주문입니다" },
          { status: 409 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Payment already confirmed",
        order: {
          id: existingOrder.orderId,
          amount: expectedAmount,
          status: existingOrder.status,
          paymentStatus: existingOrder.paymentStatus,
        },
      });
    }

    const tossResponse = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: buildTossBasicAuthHeader(secretKey),
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: expectedAmount,
        }),
      }
    );

    if (!tossResponse.ok) {
      const errorData = await tossResponse.json();
      console.error("Toss payment verification failed:", errorData);
      return NextResponse.json(
        { success: false, error: errorData.message || "Payment verification failed", details: errorData },
        { status: 400 }
      );
    }

    const paymentData = await tossResponse.json();

    if (paymentData.orderId !== orderId || !amountsMatch(expectedAmount, paymentData.totalAmount)) {
      return NextResponse.json(
        { success: false, error: "토스 결제 응답 검증에 실패했습니다" },
        { status: 400 }
      );
    }

    const updatedOrderResult = await db.update(orders).set({
        paymentStatus: PAYMENT_STATUSES.PAID,
        status: ORDER_STATUSES.CONFIRMED,
        paymentMethod: PAYMENT_METHODS.TOSS,
        userId: user.id,
        tossPaymentKey: paymentKey,
        tossOrderId: orderId,
        tossPaymentMethod: paymentData.method || null,
        tossCardCompany: paymentData.card?.company || null,
        tossCardNumber: paymentData.card?.number || null,
        tossApprovalNumber: paymentData.card?.approveNo || null,
        tossReceipt: paymentData.receipt || null,
        tossPaymentAttempts: sql`${orders.tossPaymentAttempts} + 1`,
        lastTossAttempt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(orders.orderId, orderId),
          ne(orders.paymentStatus, PAYMENT_STATUSES.PAID),
        )
      )
      .returning();

    let order = updatedOrderResult[0];

    if (!order) {
      const latestOrderResult = await db.select().from(orders).where(eq(orders.orderId, orderId)).limit(1);
      const latestOrder = latestOrderResult[0];

      if (!latestOrder) {
        return NextResponse.json(
          { success: false, error: "주문 정보를 찾을 수 없습니다" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Payment already confirmed",
        order: {
          id: latestOrder.orderId,
          amount: normalizeTossAmount(latestOrder.totalAmount),
          status: latestOrder.status,
          paymentStatus: latestOrder.paymentStatus,
        },
      });
    }

    // 🎯 파트너 커미션 처리: partner_links 업데이트 + 지급대행 요청
    if (order?.partnerLinkId) {
      try {
        console.log(`[PartnerCommission] Processing partner link: ${order.partnerLinkId}`);

        // 주문 아이템에서 총 상품 가격 계산 (배송비 제외)
        const items = await db
          .select({ price: orderItems.price, quantity: orderItems.quantity })
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        const totalProductPrice = items.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        );

        // 커미션 계산 (상품가격의 15%)
        const commission = calculatePartnerCommission(totalProductPrice);

        console.log(`[PartnerCommission] Total product price: ${totalProductPrice}, Commission (15%): ${commission}`);

        // partner_links 테이블 업데이트: conversionCount +1, revenue +커미션
        await db
          .update(partnerLinks)
          .set({
            conversionCount: sql`${partnerLinks.conversionCount} + 1`,
            revenue: sql`${partnerLinks.revenue} + ${commission}`,
            updatedAt: new Date(),
          })
          .where(eq(partnerLinks.id, order.partnerLinkId));

        console.log(`[PartnerCommission] Successfully updated partner_links for linkId: ${order.partnerLinkId}`);

        // 🔄 토스 지급대행 API 호출 (비동기 - 실패해도 결제는 성공)
        try {
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3002';
          const payoutResponse = await fetch(`${baseUrl}/api/payouts/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              partnerLinkId: order.partnerLinkId,
              commissionAmount: commission,
              orderId: order.orderId,
            }),
          });

          const payoutResult = await payoutResponse.json();
          if (payoutResult.success) {
            console.log(`[PartnerCommission] Payout requested: ${payoutResult.payout?.id}`);
          } else if (payoutResult.skipped) {
            console.log(`[PartnerCommission] Payout skipped: ${payoutResult.error}`);
          } else {
            console.error(`[PartnerCommission] Payout failed: ${payoutResult.error}`);
          }
        } catch (payoutError) {
          console.error("[PartnerCommission] Failed to request payout:", payoutError);
        }
      } catch (partnerError) {
        // 파트너 커미션 처리 실패해도 결제는 성공 처리
        console.error("[PartnerCommission] Failed to update partner_links:", partnerError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment confirmed successfully",
      order: {
        id: order?.orderId,
        amount: order?.totalAmount,
        status: order?.status,
        paymentStatus: order?.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Toss confirm error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process payment" },
      { status: 500 }
    );
  }
}