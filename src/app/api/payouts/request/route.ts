/**
 * 파트너 커미션 지급대행 API
 * 
 * 결제 완료 후 파트너에게 커미션을 지급합니다.
 * 내부 API로, toss-confirm에서 호출합니다.
 */

import { NextRequest, NextResponse } from "next/server";
import { db, partnerLinks, businessRegistrations } from "@/lib/db";
import { eq } from "drizzle-orm";
import { payPartnerCommission } from "@/lib/tossPayouts";

export async function POST(request: NextRequest) {
  try {
    const { partnerLinkId, commissionAmount, orderId } = await request.json();

    if (!partnerLinkId || !commissionAmount || !orderId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(`[Payouts] Processing payout for partnerLinkId: ${partnerLinkId}`);

    // 1. 파트너 링크에서 partnerId 조회
    const linkResult = await db
      .select({ partnerId: partnerLinks.partnerId })
      .from(partnerLinks)
      .where(eq(partnerLinks.id, partnerLinkId))
      .limit(1);

    if (linkResult.length === 0) {
      console.error(`[Payouts] Partner link not found: ${partnerLinkId}`);
      return NextResponse.json(
        { success: false, error: "Partner link not found" },
        { status: 404 }
      );
    }

    const { partnerId } = linkResult[0];

    // 2. 파트너의 sellerId 조회 (business_registrations)
    const bizResult = await db
      .select({ 
        sellerId: businessRegistrations.sellerId,
        tossStatus: businessRegistrations.tossStatus,
        businessName: businessRegistrations.businessName,
      })
      .from(businessRegistrations)
      .where(eq(businessRegistrations.userId, partnerId))
      .limit(1);

    if (bizResult.length === 0) {
      console.log(`[Payouts] Partner ${partnerId} not registered as seller - skipping payout`);
      return NextResponse.json({
        success: false,
        error: "Partner not registered as seller",
        skipped: true,
      });
    }

    const { sellerId, tossStatus, businessName } = bizResult[0];

    // 3. 토스 심사 상태 확인
    if (!sellerId) {
      console.log(`[Payouts] Partner ${businessName} has no sellerId - skipping payout`);
      return NextResponse.json({
        success: false,
        error: "Partner has no sellerId",
        skipped: true,
      });
    }

    // PARTIALLY_APPROVED, APPROVED 상태만 지급 가능
    const approvedStatuses = ['PARTIALLY_APPROVED', 'APPROVED', 'COMPLETED', 'READY'];
    if (!approvedStatuses.includes(tossStatus || '')) {
      console.log(`[Payouts] Partner ${businessName} tossStatus is ${tossStatus} - skipping payout`);
      return NextResponse.json({
        success: false,
        error: `Partner tossStatus is ${tossStatus}, not approved for payouts`,
        skipped: true,
      });
    }

    // 4. 잔액 확인 (지급 가능 금액 체크)
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (secretKey) {
      try {
        const balanceResponse = await fetch("https://api.tosspayments.com/v2/balances", {
          method: "GET",
          headers: {
            Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
          },
        });

        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          const availableAmount = balanceData?.entityBody?.availableAmount?.value || 0;

          if (availableAmount < commissionAmount) {
            console.log(`[Payouts] Insufficient balance: available ₩${availableAmount}, required ₩${commissionAmount}`);
            return NextResponse.json({
              success: false,
              error: "Insufficient balance for payout",
              skipped: true,
              availableAmount,
              requiredAmount: commissionAmount,
            });
          }

          console.log(`[Payouts] Balance check passed: available ₩${availableAmount} >= required ₩${commissionAmount}`);
        }
      } catch (balanceError) {
        // 잔액 확인 실패해도 지급 시도 (토스에서 최종 검증)
        console.warn("[Payouts] Balance check failed, proceeding anyway:", balanceError);
      }
    }

    // 5. 토스 지급대행 API 호출
    console.log(`[Payouts] Requesting payout to seller ${sellerId} (${businessName}): ₩${commissionAmount}`);

    const payoutResult = await payPartnerCommission(
      partnerLinkId,
      sellerId,
      commissionAmount,
      orderId
    );

    console.log(`[Payouts] Payout requested successfully:`, payoutResult);

    return NextResponse.json({
      success: true,
      payout: {
        id: payoutResult.id,
        refPayoutId: payoutResult.refPayoutId,
        status: payoutResult.status,
        amount: payoutResult.amount.value,
        destination: payoutResult.destination,
        requestedAt: payoutResult.requestedAt,
      },
    });

  } catch (error) {
    console.error("[Payouts] Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Payout request failed",
      },
      { status: 500 }
    );
  }
}

