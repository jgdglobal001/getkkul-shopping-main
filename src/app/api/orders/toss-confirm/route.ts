export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, users, orders, orderItems, partnerLinks } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
} from "@/lib/orderStatus";
import { calculatePartnerCommission } from "@/lib/partnerCommission";

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentKey, amount, userEmail } = await request.json();

    if (!orderId || !paymentKey || !amount || !userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: orderId, paymentKey, amount, userEmail",
        },
        { status: 400 }
      );
    }

    // Verify payment with Toss API
    const clientKey = process.env.TOSS_CLIENT_KEY;
    const secretKey = process.env.TOSS_SECRET_KEY;

    console.log("=== Toss Payment Verification ===");
    console.log("Client Key exists:", !!clientKey);
    console.log("Secret Key exists:", !!secretKey);

    if (!clientKey || !secretKey) {
      console.error("Toss API keys not configured");
      return NextResponse.json(
        { success: false, error: "Toss API keys not configured" },
        { status: 500 }
      );
    }

    const tossResponse = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
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

    // Find or create user
    const userResult = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    let user = userResult[0];

    if (!user) {
      const newUserId = generateId();
      await db.insert(users).values({
        id: newUserId,
        email: userEmail,
        name: paymentData.customerName || "Guest Customer",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const newUserResult = await db.select().from(users).where(eq(users.id, newUserId)).limit(1);
      user = newUserResult[0];
    }

    // Check if order exists
    const existingOrderResult = await db.select().from(orders).where(eq(orders.orderId, orderId)).limit(1);
    const existingOrder = existingOrderResult[0];

    let order;
    if (existingOrder) {
      // Update existing order - tossPaymentKey 저장 추가!
      await db.update(orders).set({
        paymentStatus: PAYMENT_STATUSES.PAID,
        status: ORDER_STATUSES.CONFIRMED,
        paymentMethod: PAYMENT_METHODS.TOSS,
        userId: user.id,
        tossPaymentKey: paymentKey, // ⭐ 토스 결제 키 저장
        tossOrderId: orderId,       // ⭐ 토스 주문 ID 저장
        updatedAt: new Date(),
      }).where(eq(orders.orderId, orderId));

      const updatedResult = await db.select().from(orders).where(eq(orders.orderId, orderId)).limit(1);
      order = updatedResult[0];
    } else {
      // Create new order
      const newId = generateId();
      await db.insert(orders).values({
        id: newId,
        orderId,
        userId: user.id,
        userEmail,
        status: ORDER_STATUSES.CONFIRMED,
        paymentStatus: PAYMENT_STATUSES.PAID,
        paymentMethod: PAYMENT_METHODS.TOSS,
        totalAmount: amount / 100,
        tossPaymentKey: paymentKey, // ⭐ 토스 결제 키 저장
        tossOrderId: orderId,       // ⭐ 토스 주문 ID 저장
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const newOrderResult = await db.select().from(orders).where(eq(orders.id, newId)).limit(1);
      order = newOrderResult[0];
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