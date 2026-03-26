"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiCheck, FiLoader, FiX } from "react-icons/fi";
import {
  buildBrandpayCallbackRedirectTargets,
  clearExpectedBrandpayCustomerKey,
  formatBrandpayRegistrationErrorMessage,
  isBrandpayCustomerKeyVerified,
  readBrandpayPendingReturnPath,
  readExpectedBrandpayCustomerIdentity,
  readExpectedBrandpayCustomerKey,
} from "@/lib/tossUtils";

const SUCCESS_REDIRECT_DELAY_MS = 3000;
const ERROR_REDIRECT_DELAY_MS = 2000;

type CallbackStatus = "loading" | "success" | "error";

export default function PaymentCallbackClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [message, setMessage] = useState("브랜드페이 인증을 마무리하는 중입니다...");

  useEffect(() => {
    let active = true;
    let redirectTimeoutId: number | null = null;

    const rawCode = searchParams.get("code");
    const customerKey = searchParams.get("customerKey");
    const authorizationCode = customerKey ? rawCode : null;
    const errorMessage = searchParams.get("message");
    const errorCode = searchParams.get("errorCode") ?? (customerKey ? null : rawCode);
    // Read returnPath from sessionStorage instead of URL query params.
    // The redirectUrl must be clean (no query params) to match the Toss Developer Center registration.
    const returnUrl = readBrandpayPendingReturnPath() || searchParams.get("returnUrl") || "/account/payment";
    const { successRedirectUrl, errorRedirectUrl } = buildBrandpayCallbackRedirectTargets(
      returnUrl,
      errorMessage,
      errorCode,
    );

    const redirectToTarget = (target: string, delayMs: number) => {
      if (redirectTimeoutId !== null) {
        window.clearTimeout(redirectTimeoutId);
      }

      redirectTimeoutId = window.setTimeout(() => {
        const openerWindow = window.opener;

        if (openerWindow && !openerWindow.closed) {
          try {
            openerWindow.location.replace(target);
            window.close();
            window.setTimeout(() => {
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
    };

    const finishWithError = (nextMessage: string, target = errorRedirectUrl) => {
      if (!active) return;

      const formattedMessage = formatBrandpayRegistrationErrorMessage(nextMessage);
      clearExpectedBrandpayCustomerKey(returnUrl);
      setStatus("error");
      setMessage(formattedMessage);
      redirectToTarget(target, ERROR_REDIRECT_DELAY_MS);
    };

    const processCallback = async () => {
      try {
        if (authorizationCode && customerKey) {
          setMessage("토스페이먼츠 보안 인증을 마무리하는 중입니다. 이 화면을 닫지 말아주세요...");

          const expectedCustomerKey = readExpectedBrandpayCustomerKey(returnUrl);
          const expectedCustomerIdentity = readExpectedBrandpayCustomerIdentity(returnUrl);

          if (!expectedCustomerKey) {
            throw new Error("브랜드페이 인증 정보가 만료되었습니다. 원래 화면에서 다시 시도해주세요.");
          }

          if (!isBrandpayCustomerKeyVerified(expectedCustomerKey, customerKey)) {
            throw new Error("브랜드페이 고객 인증 정보가 일치하지 않습니다. 다시 시도해주세요.");
          }

          const tokenResponse = await fetch("/api/toss/brandpay/access-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: authorizationCode,
              customerKey,
              customerIdentity: expectedCustomerIdentity,
              returnUrl,
            }),
          });

          const tokenData = (await tokenResponse.json().catch(() => null)) as
            | { message?: string; error?: string }
            | null;

          if (!tokenResponse.ok) {
            throw new Error(tokenData?.message || tokenData?.error || "Access Token 발급에 실패했습니다.");
          }

          if (!active) return;

          clearExpectedBrandpayCustomerKey(returnUrl);
          setStatus("success");
          setMessage("브랜드페이 인증이 완료되었습니다. 원래 화면으로 안전하게 돌아가는 중입니다...");
          redirectToTarget(successRedirectUrl, SUCCESS_REDIRECT_DELAY_MS);
          return;
        }

        if (errorMessage || errorCode) {
          finishWithError(errorMessage || errorCode || "카드 등록 중 오류가 발생했습니다.");
          return;
        }

        finishWithError("잘못된 접근입니다.", returnUrl);
      } catch (error) {
        console.error("[BrandPayCallback] processing error:", error);
        finishWithError(error instanceof Error ? error.message : "처리 중 오류가 발생했습니다.");
      }
    };

    processCallback();

    return () => {
      active = false;
      if (redirectTimeoutId !== null) {
        window.clearTimeout(redirectTimeoutId);
      }
    };
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <FiLoader className="text-3xl text-blue-600 animate-spin" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">처리 중</h2>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <FiCheck className="text-3xl text-green-600" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">등록 완료</h2>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <FiX className="text-3xl text-red-600" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">등록 실패</h2>
          </>
        )}

        <p className="text-gray-600">{message}</p>
        <p className="mt-4 text-sm text-gray-400">잠시 후 안전하게 이동합니다. 자동으로 닫히지 않으면 이 창을 직접 닫아주세요.</p>
      </div>
    </div>
  );
}