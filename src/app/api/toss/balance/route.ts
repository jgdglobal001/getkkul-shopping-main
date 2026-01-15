export const runtime = 'edge';

/**
 * 토스페이먼츠 정산 잔액 조회 API
 *
 * 지급대행 전 잔액이 충분한지 확인합니다.
 * - availableAmount: 지급 가능한 금액
 * - pendingAmount: 아직 지급할 수 없는 금액 (정산 대기 중)
 *
 * ⚠️ GET 요청이므로 JWE 암호화 불필요
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      console.error("[TossBalance] TOSS_SECRET_KEY not configured");
      return NextResponse.json(
        { success: false, error: "Toss API key not configured" },
        { status: 500 }
      );
    }

    // 토스 잔액 조회 API 호출
    const response = await fetch("https://api.tosspayments.com/v2/balances", {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[TossBalance] API Error:", response.status, errorText);
      return NextResponse.json(
        { 
          success: false, 
          error: `Toss API error: ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 응답 파싱
    const { entityBody } = data;
    const availableAmount = entityBody?.availableAmount?.value || 0;
    const pendingAmount = entityBody?.pendingAmount?.value || 0;
    const currency = entityBody?.availableAmount?.currency || "KRW";

    console.log(`[TossBalance] Available: ₩${availableAmount.toLocaleString()}, Pending: ₩${pendingAmount.toLocaleString()}`);

    return NextResponse.json({
      success: true,
      balance: {
        availableAmount,
        pendingAmount,
        totalAmount: availableAmount + pendingAmount,
        currency,
      },
      raw: data, // 디버깅용 원본 응답
    });

  } catch (error) {
    console.error("[TossBalance] Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch balance",
      },
      { status: 500 }
    );
  }
}

