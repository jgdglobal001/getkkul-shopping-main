export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, businessRegistrations } from "@/lib/db";
import { eq } from "drizzle-orm";

/**
 * 파트너의 sellerId 조회 API
 * partner_ref (userId)로 business_registrations에서 sellerId 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerRef = searchParams.get("partnerRef");

    if (!partnerRef) {
      return NextResponse.json(
        { sellerId: null, message: "partnerRef not provided" },
        { status: 200 }
      );
    }

    // business_registrations에서 sellerId 조회
    const result = await db
      .select({
        sellerId: businessRegistrations.sellerId,
        businessName: businessRegistrations.businessName,
        tossStatus: businessRegistrations.tossStatus,
      })
      .from(businessRegistrations)
      .where(eq(businessRegistrations.userId, partnerRef))
      .limit(1);

    if (result.length === 0) {
      console.log(`[SellerAPI] No business registration found for partnerRef: ${partnerRef}`);
      return NextResponse.json(
        { sellerId: null, message: "Partner not found" },
        { status: 200 }
      );
    }

    const { sellerId, businessName, tossStatus } = result[0];

    // 토스 심사 완료 상태인지 확인
    if (tossStatus !== "COMPLETED" && tossStatus !== "READY") {
      console.log(`[SellerAPI] Partner tossStatus is ${tossStatus}, sellerId may not be active`);
    }

    console.log(`[SellerAPI] Found sellerId for ${businessName}: ${sellerId}`);

    return NextResponse.json({
      sellerId,
      businessName,
      tossStatus,
    });
  } catch (error) {
    console.error("[SellerAPI] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch seller info" },
      { status: 500 }
    );
  }
}
