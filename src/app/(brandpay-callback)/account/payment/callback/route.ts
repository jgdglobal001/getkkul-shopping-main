import {
  buildBrandpayCallbackRedirectTargets,
  formatBrandpayRegistrationErrorMessage,
  getBrandpayCustomerKeyCookieName,
  isBrandpayCustomerKeyVerified,
  normalizeBrandpayReturnPath,
} from "@/lib/tossUtils";

export const runtime = "edge";

const SUCCESS_REDIRECT_DELAY_MS = 3000;
const ERROR_REDIRECT_DELAY_MS = 2000;

function readCookieValue(cookieHeader: string | null, cookieName: string) {
  if (!cookieHeader) {
    return null;
  }

  const prefix = `${cookieName}=`;

  for (const part of cookieHeader.split(";")) {
    const normalizedPart = part.trim();
    if (!normalizedPart.startsWith(prefix)) {
      continue;
    }

    try {
      return decodeURIComponent(normalizedPart.slice(prefix.length));
    } catch {
      return normalizedPart.slice(prefix.length);
    }
  }

  return null;
}

function buildClearCookieHeader(cookieName: string, isSecure: boolean) {
  return `${cookieName}=; Path=/; Max-Age=0; SameSite=Lax${isSecure ? "; Secure" : ""}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildCallbackHtml(status: "success" | "error", message: string, target: string, delayMs: number) {
  const title = status === "success" ? "등록 완료" : "등록 실패";
  const icon = status === "success" ? "✅" : "❌";
  const statusColor = status === "success" ? "#16a34a" : "#dc2626";

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; background: #f9fafb; color: #111827; }
      .wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
      .card { width: 100%; max-width: 420px; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); padding: 32px 24px; text-align: center; }
      .icon { font-size: 42px; margin-bottom: 16px; }
      h1 { margin: 0 0 12px; font-size: 24px; color: ${statusColor}; }
      p { margin: 0; line-height: 1.6; color: #4b5563; }
      .hint { margin-top: 18px; font-size: 13px; color: #9ca3af; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <div class="icon">${icon}</div>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(message)}</p>
        <p class="hint">잠시 후 안전하게 이동합니다. 자동으로 닫히지 않으면 이 창을 직접 닫아주세요.</p>
      </div>
    </div>
    <script>
      (function () {
        var target = ${JSON.stringify(target)};
        var delayMs = ${JSON.stringify(delayMs)};

        window.setTimeout(function () {
          var openerWindow = window.opener;

          if (openerWindow && !openerWindow.closed) {
            try {
              openerWindow.location.replace(target);
              window.close();
              window.setTimeout(function () {
                if (!window.closed) {
                  window.location.replace(target);
                }
              }, 300);
              return;
            } catch (error) {
              console.warn("[BrandPayCallback] Failed to redirect opener window:", error);
            }
          }

          window.location.replace(target);
        }, delayMs);
      })();
    </script>
  </body>
</html>`;
}

async function exchangeBrandpayAccessToken(code: string, customerKey: string) {
  const secretKey = process.env.TOSS_WIDGET_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Server configuration error");
  }

  const basicToken = btoa(`${secretKey}:`);
  const response = await fetch("https://api.tosspayments.com/v1/brandpay/authorizations/access-token", {
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
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const nextMessage =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error?.message === "string"
          ? data.error.message
          : typeof data?.error === "string"
            ? data.error
            : "Access Token 발급에 실패했습니다.";

    throw new Error(`보안 인증 실패: ${nextMessage}`);
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const returnUrl = normalizeBrandpayReturnPath(requestUrl.searchParams.get("returnUrl"));
  const errorMessage = requestUrl.searchParams.get("message");
  const errorCode = requestUrl.searchParams.get("errorCode");
  const code = requestUrl.searchParams.get("code");
  const customerKey = requestUrl.searchParams.get("customerKey");
  const redirectTargets = buildBrandpayCallbackRedirectTargets(returnUrl, errorMessage, errorCode);
  const cookieName = getBrandpayCustomerKeyCookieName(returnUrl);
  const expectedCustomerKey = readCookieValue(request.headers.get("cookie"), cookieName);
  const isSecure = requestUrl.protocol === "https:";

  let status: "success" | "error" = "error";
  let message = "카드 등록 중 오류가 발생했습니다.";
  let target = redirectTargets.errorRedirectUrl;
  let delayMs = ERROR_REDIRECT_DELAY_MS;

  try {
    if (code && customerKey) {
      if (!expectedCustomerKey) {
        throw new Error("브랜드페이 인증 정보가 만료되었습니다. 원래 화면에서 다시 시도해주세요.");
      }

      if (!isBrandpayCustomerKeyVerified(expectedCustomerKey, customerKey)) {
        throw new Error("브랜드페이 고객 인증 정보가 일치하지 않습니다. 다시 시도해주세요.");
      }

      await exchangeBrandpayAccessToken(code, customerKey);
      status = "success";
      message = "브랜드페이 인증이 완료되었습니다. 원래 화면으로 안전하게 돌아가는 중입니다...";
      target = redirectTargets.successRedirectUrl;
      delayMs = SUCCESS_REDIRECT_DELAY_MS;
    } else if (errorMessage || errorCode) {
      message = formatBrandpayRegistrationErrorMessage(errorMessage || errorCode);
    } else {
      message = "잘못된 접근입니다.";
      target = returnUrl;
    }
  } catch (error) {
    console.error("[BrandPayCallbackRoute] processing error:", error);
    message = formatBrandpayRegistrationErrorMessage(
      error instanceof Error ? error.message : "처리 중 오류가 발생했습니다.",
    );
    target = buildBrandpayCallbackRedirectTargets(returnUrl, message, null).errorRedirectUrl;
  }

  const response = new Response(buildCallbackHtml(status, message, target, delayMs), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });

  response.headers.append("Set-Cookie", buildClearCookieHeader(cookieName, isSecure));

  return response;
}