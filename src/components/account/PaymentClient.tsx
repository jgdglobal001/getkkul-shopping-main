"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FiCreditCard, FiSettings, FiLoader, FiCheck, FiAlertCircle } from "react-icons/fi";
import {
  buildBrandpayCustomerIdentity,
  buildTossCustomerKey,
  formatBrandpayRegistrationErrorMessage,
  getBrandpayRedirectUrl,
  persistExpectedBrandpayCustomerKey,
} from "@/lib/tossUtils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTossPaymentsReady } from "@/hooks/useTossPayments";

export default function PaymentClient() {
  const { data: session, status } = useSession();
  const { user } = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const brandpayReturnPath = "/account/payment";
  const customerKey = useMemo(
    () =>
      buildTossCustomerKey({
        userId: session?.user?.id,
        email: session?.user?.email,
      }),
    [session?.user?.email, session?.user?.id],
  );
  const brandpayCustomerIdentity = useMemo(
    () =>
      buildBrandpayCustomerIdentity({
        name: session?.user?.name || user?.name,
        mobilePhone: user?.phone,
      }),
    [session?.user?.name, user?.name, user?.phone],
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { isReady: tossReady, sdkError, tossPaymentsFactory } = useTossPaymentsReady();

  useEffect(() => {
    // 성공/실패 메시지 처리
    const success = searchParams.get("success");
    const errorParam = searchParams.get("error");

    if (success === "true") {
      setSuccessMessage(t("account.card_added") || "결제 수단이 성공적으로 등록되었습니다.");
      // URL에서 파라미터 제거
      router.replace("/account/payment");
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
      router.replace("/account/payment");
    }
  }, [searchParams, router, t]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (status !== "authenticated" || !sdkError) return;

    setError(sdkError);
  }, [sdkError, status]);

  const createBrandpay = useCallback(() => {
    const tossClientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    if (!tossClientKey) {
      throw new Error("Toss Client Key is not configured.");
    }

    if (!customerKey) {
      throw new Error("고객 식별 정보를 확인할 수 없습니다. 다시 로그인 후 시도해주세요.");
    }

    if (!tossReady || !tossPaymentsFactory) {
      throw new Error(sdkError || "결제 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }

    return tossPaymentsFactory(tossClientKey).brandpay({
      customerKey,
      redirectUrl: getBrandpayRedirectUrl(window.location.origin, brandpayReturnPath),
    });
  }, [brandpayReturnPath, customerKey, sdkError, tossPaymentsFactory, tossReady]);

  const handleAddCard = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!customerKey) {
        throw new Error("고객 식별 정보를 확인할 수 없습니다. 다시 로그인 후 시도해주세요.");
      }
      const brandpay = createBrandpay();
      persistExpectedBrandpayCustomerKey(customerKey, brandpayReturnPath, {
        customerIdentity: brandpayCustomerIdentity,
      });
      await brandpay.addPaymentMethod();
    } catch (err: any) {
      console.error("Error adding card:", err);
      const errorMessage = err?.message || "";
      if (!errorMessage.includes("취소")) {
        setError(formatBrandpayRegistrationErrorMessage(errorMessage));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManageCards = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!customerKey) {
        throw new Error("고객 식별 정보를 확인할 수 없습니다. 다시 로그인 후 시도해주세요.");
      }
      const brandpay = createBrandpay();
      persistExpectedBrandpayCustomerKey(customerKey, brandpayReturnPath, {
        customerIdentity: brandpayCustomerIdentity,
      });
      await brandpay.openSettings();
    } catch (err: any) {
      console.error("Error opening brandpay settings:", err);
      const errorMessage = err?.message || "";
      if (!errorMessage.includes("취소")) {
        setError(formatBrandpayRegistrationErrorMessage(errorMessage));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("account.payment_methods") || "결제 수단"}</h1>
        <p className="text-gray-600">
          안전하고 간편한 브랜드페이로 결제 수단을 등록하고 관리하세요.
        </p>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <FiCheck className="text-green-500 mr-3 flex-shrink-0" />
          <span className="text-green-700">{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <FiAlertCircle className="text-red-500 mr-3 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-8 text-center border border-gray-100">
        <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full flex flex-col items-center justify-center">
          <FiCreditCard className="text-4xl text-blue-600" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          겟꿀페이 간편결제 (BrandPay)
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          한 번만 결제수단을 등록해두면, 결제 시마다 카드번호를 입력할 필요 없이 설정하신 비밀번호 하나로 쉽고 빠르게 결제할 수 있습니다!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
          <button
            onClick={handleAddCard}
            disabled={loading || status === "loading" || status === "unauthenticated" || !tossReady}
            className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-theme-color text-white rounded-xl hover:bg-theme-color/90 transition-colors disabled:opacity-50 text-base font-medium shadow-md shadow-theme-color/20"
          >
            {loading || status === "loading" ? (
              <FiLoader className="animate-spin mr-2 text-xl" />
            ) : (
              <FiCreditCard className="mr-2 text-xl" />
            )}
            결제수단 추가하기
          </button>
          
          <button
            onClick={handleManageCards}
            disabled={loading || status === "loading" || status === "unauthenticated" || !tossReady}
            className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 text-base font-medium"
          >
            {loading || status === "loading" ? (
              <FiLoader className="animate-spin mr-2 text-xl" />
            ) : (
              <FiSettings className="mr-2 text-xl" />
            )}
            결제 설정 (조회/삭제)
          </button>
        </div>
      </div>
    </div>
  );
}
