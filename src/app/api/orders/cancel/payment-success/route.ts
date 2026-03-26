export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, orders, orderItems, partnerLinks } from "@/lib/db";
import { and, eq, ne, sql } from "drizzle-orm";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/orderStatus";
import { calculatePartnerCommission } from "@/lib/partnerCommission";
import {
    amountsMatch,
    buildTossBasicAuthHeader,
    calculateCancelPaymentAmount,
    normalizeTossAmount,
} from "@/lib/tossPaymentValidation";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const paymentKey = searchParams.get("paymentKey");
        const paymentId = searchParams.get("orderId"); // This is the new payment ID (e.g. cancel-order_id-timestamp)
        const amount = searchParams.get("amount");
        const originalOrderId = searchParams.get("originalOrderId");
        const normalizedRequestedAmount = normalizeTossAmount(amount);

        if (!paymentKey || !paymentId || !originalOrderId || normalizedRequestedAmount === null) {
            return NextResponse.redirect(new URL(`/account/orders?error=missing_params`, request.url));
        }

        if (!paymentId.startsWith(`cancel-${originalOrderId}-`)) {
            return NextResponse.redirect(new URL(`/account/orders?error=invalid_cancel_payment`, request.url));
        }

        const orderResult = await db
            .select()
            .from(orders)
            .where(eq(orders.id, originalOrderId))
            .limit(1);

        const originalOrder = orderResult[0];

        if (!originalOrder) {
            return NextResponse.redirect(new URL(`/account/orders?error=order_not_found`, request.url));
        }

        if (originalOrder.status === ORDER_STATUSES.CANCELLED) {
            return NextResponse.redirect(new URL(`/account/orders?status=cancelled_success`, request.url));
        }

        if (originalOrder.paymentStatus !== PAYMENT_STATUSES.PAID) {
            return NextResponse.redirect(new URL(`/account/orders?error=invalid_order_state`, request.url));
        }

        const expectedAmount = calculateCancelPaymentAmount(originalOrder.totalAmount);

        if (expectedAmount === null || expectedAmount <= 0) {
            return NextResponse.redirect(new URL(`/account/orders?error=invalid_cancel_amount`, request.url));
        }

        if (expectedAmount !== normalizedRequestedAmount) {
            return NextResponse.redirect(new URL(`/account/orders?error=amount_mismatch`, request.url));
        }

        // 1. 토스페이먼츠 결제 승인 요청
        const secretKey = process.env.TOSS_WIDGET_SECRET_KEY;
        if (!secretKey) {
            console.error("TOSS_WIDGET_SECRET_KEY not found");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const confirmResponse = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
            method: "POST",
            headers: {
                "Authorization": buildTossBasicAuthHeader(secretKey),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                paymentKey,
                orderId: paymentId,
                amount: expectedAmount,
            }),
        });

        const confirmResult = await confirmResponse.json();

        if (!confirmResponse.ok) {
            console.error("Payment confirmation failed:", confirmResult);
            return NextResponse.redirect(
                new URL(`/account/orders?error=${encodeURIComponent(confirmResult.message || "Payment confirmation failed")}`, request.url)
            );
        }

        if (confirmResult.orderId !== paymentId || !amountsMatch(expectedAmount, confirmResult.totalAmount)) {
            return NextResponse.redirect(new URL(`/account/orders?error=amount_verification_failed`, request.url));
        }

        // 2. 원본 주문 상태 업데이트 (취소 처리)
        // 주의: 기존 결제는 취소하지 않음 (전액 배송비/수수료로 귀속됨)
        const updatedOrderResult = await db.update(orders).set({
            status: ORDER_STATUSES.CANCELLED,
            paymentStatus: PAYMENT_STATUSES.PAID,
            updatedAt: new Date(),
        }).where(
            and(
                eq(orders.id, originalOrderId),
                ne(orders.status, ORDER_STATUSES.CANCELLED),
            )
        ).returning();

        const order = updatedOrderResult[0];

        if (!order) {
            return NextResponse.redirect(new URL(`/account/orders?status=cancelled_success`, request.url));
        }

        // 3. 파트너 커미션 회수 (partnerLinkId가 있는 경우)
        if (order && order.partnerLinkId) {
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

                // partner_links 테이블 업데이트
                await db
                    .update(partnerLinks)
                    .set({
                        conversionCount: sql`GREATEST(${partnerLinks.conversionCount} - 1, 0)`,
                        revenue: sql`GREATEST(${partnerLinks.revenue} - ${commission}, 0)`,
                        updatedAt: new Date(),
                    })
                    .where(eq(partnerLinks.id, order.partnerLinkId));

                console.log(`[OrderCancelSuccess] Partner commission deducted: ₩${commission}`);
            } catch (commissionError) {
                console.error("[OrderCancelSuccess] Failed to deduct commission:", commissionError);
            }
        }

        // 4. 성공 리다이렉트
        return NextResponse.redirect(new URL(`/account/orders?status=cancelled_success`, request.url));

    } catch (error) {
        console.error("[OrderCancelSuccess] Error:", error);
        return NextResponse.redirect(new URL(`/account/orders?error=processing_error`, request.url));
    }
}
