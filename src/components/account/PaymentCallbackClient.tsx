"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiCheck, FiLoader, FiX } from "react-icons/fi";
import {
  buildBrandpayCallbackRedirectTargets,
  clearExpectedBrandpayCustomerKey,
  isBrandpayCustomerKeyVerified,
  normalizeBrandpayReturnPath,
  readExpectedBrandpayCustomerKey,
} from "@/lib/tossUtils";

const SUCCESS_REDIRECT_DELAY_MS = 3000;
const ERROR_REDIRECT_DELAY_MS = 2000;

type CallbackStatus = "loading" | "success" | "error";

export default function PaymentCallbackClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [message, setMessage] = useState("카드 정보를 등록하는 중입니다...");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const clearRedirectTimer = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const redirectTo = (target: string, delayMs: number) => {
      clearRedirectTimer();

      timeoutRef.current = window.setTimeout(() => {
        if (!active) return;

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

    const buildRedirectTargets = () => {
      const errorMessage = searchParams.get("message");
      const errorCode = searchParams.get("errorCode");
      const redirectTargets = buildBrandpayCallbackRedirectTargets(
        searchParams.get("returnUrl"),
        errorMessage,
        errorCode,
      );

      return {
        customerKey: searchParams.get("customerKey"),
        code: searchParams.get("code"),
        errorMessage,
        errorCode,
        ...redirectTargets,
      };
    };

    const processCallback = async () => {
      try {
        const {
          customerKey,
          code,
          errorMessage,
          errorCode,
          returnUrl,
          successRedirectUrl,
          errorRedirectUrl,
        } = buildRedirectTargets();

        if (code && customerKey) {
          setMessage("토스페이먼츠 보안 인증을 마무리하는 중입니다. 이 화면을 닫지 말아주세요...");

          const expectedCustomerKey = readExpectedBrandpayCustomerKey(returnUrl);

          if (!expectedCustomerKey) {
            throw new Error("브랜드페이 인증 정보가 만료되었습니다. 원래 화면에서 다시 시도해주세요.");
          }

          if (!isBrandpayCustomerKeyVerified(expectedCustomerKey, customerKey)) {
            clearExpectedBrandpayCustomerKey(returnUrl);
            throw new Error("브랜드페이 고객 인증 정보가 일치하지 않습니다. 다시 시도해주세요.");
          }

          const tokenResponse = await fetch("/api/toss/brandpay/access-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, customerKey }),
          });

          let tokenData: Record<string, unknown> | null = null;
          try {
            tokenData = await tokenResponse.json();
          } catch {
            tokenData = null;
          }

          if (!tokenResponse.ok) {
            const nextMessage =
              typeof tokenData?.message === "string"
                ? tokenData.message
                : typeof tokenData?.error === "string"
                  ? tokenData.error
                  : "Access Token 발급 에러";

            throw new Error(`보안 인증 실패: ${nextMessage}`);
          }

          if (!active) return;

          clearExpectedBrandpayCustomerKey(returnUrl);
          setStatus("success");
          setMessage("브랜드페이 인증이 완료되었습니다. 원래 화면으로 안전하게 돌아가는 중입니다...");
          redirectTo(successRedirectUrl, SUCCESS_REDIRECT_DELAY_MS);
          return;
        }

        if (errorMessage || errorCode) {
          clearExpectedBrandpayCustomerKey(returnUrl);
          setStatus("error");
          setMessage(errorMessage || errorCode || "카드 등록 중 오류가 발생했습니다.");
          redirectTo(errorRedirectUrl, ERROR_REDIRECT_DELAY_MS);
          return;
        }

        setStatus("error");
        setMessage("잘못된 접근입니다.");
        clearExpectedBrandpayCustomerKey(returnUrl);
        redirectTo(returnUrl, ERROR_REDIRECT_DELAY_MS);
      } catch (error) {
        console.error("[BrandPayCallback] processing error:", error);

        if (!active) return;

        setStatus("error");
        const returnUrl = normalizeBrandpayReturnPath(searchParams.get("returnUrl"));
        const nextMessage = error instanceof Error ? error.message : "처리 중 오류가 발생했습니다.";
        clearExpectedBrandpayCustomerKey(returnUrl);
        setMessage(nextMessage);

        const { errorRedirectUrl } = buildBrandpayCallbackRedirectTargets(returnUrl, nextMessage, null);

        redirectTo(errorRedirectUrl, ERROR_REDIRECT_DELAY_MS);
      }
    };

    processCallback();

    return () => {
      active = false;
      clearRedirectTimer();
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full mx-4">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <FiLoader className="text-3xl text-blue-600 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">처리 중</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheck className="text-3xl text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">등록 완료</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <FiX className="text-3xl text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">등록 실패</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        <p className="text-sm text-gray-400 mt-4">
          잠시 후 안전하게 이동합니다. 자동으로 닫히지 않으면 이 창을 직접 닫아주세요.
        </p>
      </div>
    </div>
  );
}