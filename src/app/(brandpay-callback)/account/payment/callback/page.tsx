export const runtime = "edge";

import { cookies } from "next/headers";
import {
  getBrandpayCustomerKeyCookieName,
  normalizeBrandpayReturnPath,
  buildBrandpayCustomerIdentity,
  isBrandpayCustomerKeyVerified,
} from "@/lib/tossUtils";

/**
 * BrandPay callback page — runs entirely during SSR.
 *
 * The Toss SDK loads this page inside an iframe and expects the access-token
 * exchange to complete before it polls for `customerToken`.  A client-side
 * `useEffect` never fires quickly enough (or at all) in that context, so the
 * exchange MUST happen server-side during SSR.
 */
export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : null;
  const customerKey = typeof params.customerKey === "string" ? params.customerKey : null;
  const errorMessage = typeof params.message === "string" ? params.message : null;
  const errorCode = typeof params.errorCode === "string" ? params.errorCode : null;

  // If this is an error callback from the SDK, just render an error message.
  if (!code || !customerKey) {
    const msg = errorMessage || errorCode || "잘못된 접근입니다.";
    return <CallbackResult status="error" message={msg} />;
  }

  // ── Cookie verification ───────────────────────────────────────────────
  const returnPath = normalizeBrandpayReturnPath(null);
  const cookieName = getBrandpayCustomerKeyCookieName(returnPath);
  const cookieStore = await cookies();
  const expectedCustomerKey = cookieStore.get(cookieName)?.value ?? null;

  if (!expectedCustomerKey) {
    return (
      <CallbackResult
        status="error"
        message="브랜드페이 인증 정보가 만료되었습니다. 원래 화면에서 다시 시도해주세요."
      />
    );
  }

  if (!isBrandpayCustomerKeyVerified(expectedCustomerKey, customerKey)) {
    return (
      <CallbackResult
        status="error"
        message="브랜드페이 고객 인증 정보가 일치하지 않습니다. 다시 시도해주세요."
      />
    );
  }

  // ── Exchange authorization code for access token ──────────────────────
  const secretKey = process.env.TOSS_WIDGET_SECRET_KEY;
  if (!secretKey) {
    console.error("[BrandPayCallback SSR] TOSS_WIDGET_SECRET_KEY is not defined");
    return <CallbackResult status="error" message="서버 설정 오류가 발생했습니다." />;
  }

  const basicToken = btoa(`${secretKey}:`);

  try {
    const tossResponse = await fetch(
      "https://api.tosspayments.com/v1/brandpay/authorizations/access-token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grantType: "AuthorizationCode",
          code,
          customerKey,
        }),
      },
    );

    const data = await tossResponse.json().catch(() => null);

    if (!tossResponse.ok) {
      console.error("[BrandPayCallback SSR] Toss token error:", data);
      const msg =
        data?.message || data?.error?.message || "Access Token 발급에 실패했습니다.";
      return <CallbackResult status="error" message={msg} />;
    }

    // Success — the SDK will pick up the customerToken via its polling mechanism.
    return (
      <CallbackResult
        status="success"
        message="브랜드페이 인증을 처리했습니다. 잠시만 기다려주세요..."
      />
    );
  } catch (err: any) {
    console.error("[BrandPayCallback SSR] fetch error:", err);
    return <CallbackResult status="error" message="처리 중 오류가 발생했습니다." />;
  }
}

/* ── Minimal UI (no client JS needed) ──────────────────────────────────── */

function CallbackResult({
  status,
  message,
}: {
  status: "success" | "error";
  message: string;
}) {
  const isSuccess = status === "success";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f9fafb",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: "100%",
          padding: 32,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,.1)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            margin: "0 auto 16px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            background: isSuccess ? "#d1fae5" : "#fee2e2",
            color: isSuccess ? "#059669" : "#dc2626",
          }}
        >
          {isSuccess ? "✓" : "✕"}
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 18, color: "#111827" }}>
          {isSuccess ? "처리 완료" : "오류 발생"}
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>{message}</p>
        <p style={{ marginTop: 16, fontSize: 12, color: "#9ca3af" }}>
          자동으로 닫히지 않으면 이 창을 직접 닫아주세요.
        </p>
      </div>
    </div>
  );
}