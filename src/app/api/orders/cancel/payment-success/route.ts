export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, orders, orderItems, partnerLinks } from "@/lib/db";
import { eq, sql } from "drizzle-orm";

// 커미션 계산 (15%) - Duplicate of logic in cancel route
function calculatePartnerCommission(productPrice: number): number {
    return Math.round(productPrice * 0.15);
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const paymentKey = searchParams.get("paymentKey");
        const paymentId = searchParams.get("orderId"); // This is the new payment ID (e.g. cancel-order_id-timestamp)
        const amount = searchParams.get("amount");
        const originalOrderId = searchParams.get("originalOrderId");

        if (!paymentKey || !paymentId || !amount || !originalOrderId) {
            return NextResponse.redirect(new URL(`/account/orders?error=missing_params`, request.url));
        }

        // 1. 토스페이먼츠 결제 승인 요청
        const secretKey = process.env.TOSS_SECRET_KEY;
        if (!secretKey) {
            console.error("TOSS_SECRET_KEY not found");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const confirmResponse = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                paymentKey,
                orderId: paymentId,
                amount: Number(amount),
            }),
        });

        const confirmResult = await confirmResponse.json();

        if (!confirmResponse.ok) {
            console.error("Payment confirmation failed:", confirmResult);
            return NextResponse.redirect(
                new URL(`/account/orders?error=${encodeURIComponent(confirmResult.message || "Payment confirmation failed")}`, request.url)
            );
        }

        // 2. 원본 주문 상태 업데이트 (취소 처리)
        // 주의: 기존 결제는 취소하지 않음 (전액 배송비/수수료로 귀속됨)
        await db.update(orders).set({
            status: "cancelled",
            paymentStatus: "paid", // 상태는 paid로 유지하거나, cancelled로 변경? -> 'cancelled'가 맞음. 돈은 받았지만 주문은 취소됨.
            // 근데 db schema 상 status가 cancelled면 UI에서 빨간색으로 뜸. 
            // paymentStatus는 'refunded'가 아니라 'paid'로 두는게 맞음 (환불 안해줬으니까). 
            // 하지만 헷갈릴 수 있으니 paymentStatus도 업데이트 안하거나, 특수 상태로?
            // 일단 status만 'cancelled'로 변경.
            updatedAt: new Date(),
        }).where(eq(orders.id, originalOrderId));

        // 3. 파트너 커미션 회수 (partnerLinkId가 있는 경우)
        // 주문 정보를 가져와서 파트너 링크 확인
        const orderResult = await db
            .select()
            .from(orders)
            .where(eq(orders.id, originalOrderId))
            .limit(1);

        const order = orderResult[0];

        if (order && order.partnerLinkId) {
            try {
                // 주문 아이템에서 총 상품 가격 계산
                const items = await db
                    .select({ price: orderItems.price, quantity: orderItems.quantity })
                    .from(orderItems)
                    .where(eq(orderItems.orderId, originalOrderId));

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
