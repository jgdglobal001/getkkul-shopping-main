import { NextResponse } from "next/server";
import { buildTossBasicAuthHeader } from "@/lib/tossPaymentValidation";

export const runtime = "edge";

/**
 * GET /api/toss/brandpay/methods?customerKey=xxx
 *
 * SecretKey(gsk_) Basic Auth를 사용하여 BrandPay 등록 결제수단을 조회합니다.
 * Toss API: GET /v1/brandpay/payments/methods/{customerKey}
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerKey = searchParams.get("customerKey");

    if (!customerKey) {
      return NextResponse.json(
        { error: "customerKey가 필요합니다." },
        { status: 400 },
      );
    }

    const secretKey = process.env.TOSS_WIDGET_SECRET_KEY;
    if (!secretKey) {
      console.error("[BrandPay Methods] TOSS_WIDGET_SECRET_KEY is not defined");
      return NextResponse.json(
        { error: "서버 설정 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    const tossResponse = await fetch(
      `https://api.tosspayments.com/v1/brandpay/payments/methods/${encodeURIComponent(customerKey)}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: buildTossBasicAuthHeader(secretKey),
        },
      },
    );

    const data = await tossResponse.json().catch(() => null);

    if (!tossResponse.ok) {
      console.error("[BrandPay Methods] Toss API error:", tossResponse.status, data);

      // 고객이 브랜드페이에 아직 가입하지 않은 경우 빈 결과 반환
      if (
        tossResponse.status === 404 ||
        data?.code === "NOT_FOUND_CUSTOMER" ||
        data?.code === "NOT_REGISTERED_CUSTOMER"
      ) {
        return NextResponse.json({
          cards: [],
          accounts: [],
          isIdentified: false,
          selectedMethodId: null,
        });
      }

      return NextResponse.json(
        {
          error: data?.message || "결제수단 조회에 실패했습니다.",
          code: data?.code,
        },
        { status: tossResponse.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[BrandPay Methods] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

