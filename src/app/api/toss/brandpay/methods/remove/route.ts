import { NextResponse } from "next/server";
import { buildTossBasicAuthHeader } from "@/lib/tossPaymentValidation";

export const runtime = "edge";

const TOSS_API_BASE = "https://api.tosspayments.com";

/**
 * POST /api/toss/brandpay/methods/remove
 *
 * 서버사이드에서 accessToken을 획득한 뒤 카드 결제수단을 삭제합니다.
 * 전체 흐름: 약관 조회 → 약관 동의 → code → accessToken → 카드 삭제
 *
 * Body: { customerKey: string, methodKey: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const customerKey = typeof body?.customerKey === "string" ? body.customerKey : null;
    const methodKey = typeof body?.methodKey === "string" ? body.methodKey : null;

    if (!customerKey || !methodKey) {
      return NextResponse.json(
        { error: "customerKey와 methodKey가 필요합니다." },
        { status: 400 },
      );
    }

    const secretKey = process.env.TOSS_WIDGET_SECRET_KEY;
    if (!secretKey) {
      console.error("[BrandPay Remove] TOSS_WIDGET_SECRET_KEY is not defined");
      return NextResponse.json(
        { error: "서버 설정 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    const basicAuth = buildTossBasicAuthHeader(secretKey);

    // ── Step 1: 약관 조회 (미동의 약관 ID 수집) ──
    const termsUrl = `${TOSS_API_BASE}/v1/brandpay/terms?customerKey=${encodeURIComponent(customerKey)}&scope=REGISTER,CARD`;
    const termsRes = await fetch(termsUrl, {
      method: "GET",
      cache: "no-store",
      headers: { Authorization: basicAuth },
    });

    if (!termsRes.ok) {
      const termsErr = await termsRes.json().catch(() => null);
      console.error("[BrandPay Remove] Terms query failed:", termsRes.status, termsErr);
      return NextResponse.json(
        { error: termsErr?.message || "약관 정보 조회에 실패했습니다." },
        { status: termsRes.status },
      );
    }

    const terms: Array<{ id: number; agreed: boolean }> = await termsRes.json();
    // 모든 약관 ID를 전송 (이미 동의한 약관도 포함 — 재동의로 code 발급)
    const allTermIds = terms.map((t) => t.id);

    if (allTermIds.length === 0) {
      return NextResponse.json(
        { error: "약관 정보를 찾을 수 없습니다." },
        { status: 400 },
      );
    }

    // ── Step 2: 약관 동의 → code 발급 ──
    const agreeRes = await fetch(`${TOSS_API_BASE}/v1/brandpay/terms/agree`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: basicAuth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerKey,
        scope: ["REGISTER", "CARD"],
        termsId: allTermIds,
      }),
    });

    const agreeData = await agreeRes.json().catch(() => null);

    if (!agreeRes.ok || !agreeData?.code) {
      console.error("[BrandPay Remove] Terms agree failed:", agreeRes.status, agreeData);
      return NextResponse.json(
        { error: agreeData?.message || "약관 동의 처리에 실패했습니다." },
        { status: agreeRes.status || 500 },
      );
    }

    // ── Step 3: code → accessToken 발급 ──
    const tokenRes = await fetch(`${TOSS_API_BASE}/v1/brandpay/authorizations/access-token`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: basicAuth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grantType: "AuthorizationCode",
        code: agreeData.code,
        customerKey,
      }),
    });

    const tokenData = await tokenRes.json().catch(() => null);

    if (!tokenRes.ok || !tokenData?.accessToken) {
      console.error("[BrandPay Remove] Token exchange failed:", tokenRes.status, tokenData);
      return NextResponse.json(
        { error: tokenData?.message || "인증 토큰 발급에 실패했습니다." },
        { status: tokenRes.status || 500 },
      );
    }

    // ── Step 4: accessToken으로 카드 삭제 ──
    const removeRes = await fetch(`${TOSS_API_BASE}/v1/brandpay/payments/methods/card/remove`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${tokenData.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ methodKey }),
    });

    const removeData = await removeRes.json().catch(() => null);

    if (!removeRes.ok) {
      console.error("[BrandPay Remove] Card remove failed:", removeRes.status, removeData);
      return NextResponse.json(
        { error: removeData?.message || "카드 삭제에 실패했습니다." },
        { status: removeRes.status },
      );
    }

    return NextResponse.json({
      success: true,
      removedCard: removeData,
    });
  } catch (error: any) {
    console.error("[BrandPay Remove] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

