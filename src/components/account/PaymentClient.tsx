"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FiCreditCard, FiSettings, FiLoader, FiCheck, FiAlertCircle } from "react-icons/fi";

export default function PaymentClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const initBrandpay = () => {
    // 브랜드페이 API 개별 연동 키(Client Key) 사용 필수 (결제위젯 키 gck 지원 안함)
    const tossClientKey = process.env.NEXT_PUBLIC_TOSS_BRANDPAY_CLIENT_KEY;
    if (!tossClientKey) {
      throw new Error("브랜드페이 개별 연동 클라이언트 키 설정 오류입니다. 관리자에게 문의하세요.");
    }

    const TossPayments = (window as any).TossPayments;
    if (!TossPayments) {
      throw new Error("결제 SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }

    // 회원 고유 ID를 기반으로 고정된 customerKey 생성. 랜덤값(Date.now) 절대 사용 금지 (429 에러 방지)
    const userId = session?.user?.id || session?.user?.email?.replace(/[@.]/g, "_");
    if (!userId) {
      throw new Error("고객 식별 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
    }
    
    // 영문, 숫자, 특수문자 -, _ 만 허용되며 최대 50자
    const customerKey = `customer_${userId}`.slice(0, 50);

    // TossPayments SDK v2 인스턴스 초기화
    const tossPayments = TossPayments(tossClientKey);
    return tossPayments.brandpay({
      customerKey,
      redirectUrl: `${window.location.origin}/account/payment/callback`,
    });
  };

  const handleAddCard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const brandpay = initBrandpay();
      await brandpay.addPaymentMethod();
    } catch (err: any) {
      console.error("Error adding card:", err);
      const errorMessage = err?.message || "카드 등록 중 오류가 발생했습니다.";
      if (!errorMessage.includes("취소")) {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManageCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const brandpay = initBrandpay();
      // Toss V2 SDK에서는 별도의 메소드 없이 openSettings() 창에서 결제수단 추가 및 관리를 통합 제공합니다.
      await brandpay.openSettings();
    } catch (err: any) {
      console.error("Error opening brandpay settings:", err);
      const errorMessage = err?.message || "설정창을 여는 중 오류가 발생했습니다.";
      if (!errorMessage.includes("취소")) {
        setError(errorMessage);
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
            disabled={loading || status === "loading" || status === "unauthenticated"}
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
            disabled={loading || status === "loading" || status === "unauthenticated"}
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
