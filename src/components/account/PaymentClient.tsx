"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FiCreditCard, FiPlus, FiTrash2, FiLoader, FiCheck, FiAlertCircle } from "react-icons/fi";

interface PaymentMethod {
  id: string;
  billingKey: string;
  cardCompany: string | null;
  cardNumber: string | null;
  cardType: string | null;
  ownerType: string | null;
  isDefault: boolean;
  createdAt: string;
}

// 카드사 코드를 한글 이름으로 변환
const cardCompanyNames: Record<string, string> = {
  "3K": "기업BC",
  "46": "광주",
  "71": "롯데",
  "30": "KDB산업",
  "31": "BC",
  "51": "삼성",
  "38": "새마을",
  "41": "신한",
  "62": "신협",
  "36": "씨티",
  "33": "우리",
  "W1": "우리",
  "37": "우체국",
  "39": "저축",
  "35": "전북",
  "42": "제주",
  "15": "카카오뱅크",
  "3A": "케이뱅크",
  "24": "토스뱅크",
  "21": "하나",
  "61": "현대",
  "11": "KB국민",
  "91": "NH농협",
  "34": "Sh수협",
};

export default function PaymentClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 결제 수단 목록 조회
  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/payment-methods");
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
      } else {
        console.error("Failed to fetch payment methods");
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 로딩 및 콜백 처리
  useEffect(() => {
    fetchPaymentMethods();

    // 성공/실패 메시지 처리
    const success = searchParams.get("success");
    const errorParam = searchParams.get("error");

    if (success === "true") {
      setSuccessMessage(t("account.card_added") || "카드가 등록되었습니다.");
      // URL에서 파라미터 제거
      router.replace("/account/payment");
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
      router.replace("/account/payment");
    }
  }, [fetchPaymentMethods, searchParams, router, t]);

  // 성공 메시지 자동 숨김
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // 에러 메시지 자동 숨김
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // 카드 등록 시작
  const handleAddCard = async () => {
    try {
      setIsAddingCard(true);
      setError(null);

      // 빌링(자동결제)용 API 개별 연동 키 사용
      const tossClientKey = process.env.NEXT_PUBLIC_TOSS_BILLING_CLIENT_KEY;
      if (!tossClientKey) {
        setError("빌링 결제 시스템 설정 오류입니다. 관리자에게 문의하세요.");
        return;
      }


      // TossPayments SDK 확인
      const TossPayments = (window as any).TossPayments;
      if (!TossPayments) {
        setError("결제 SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      // 고유한 customerKey 생성
      const customerKey = `customer_${session?.user?.id || session?.user?.email?.replace(/[@.]/g, "_") || Date.now()}`;

      // TossPayments 인스턴스 생성
      const tossPayments = TossPayments(tossClientKey);
      const payment = tossPayments.payment({ customerKey });

      // 빌링 인증 요청
      await payment.requestBillingAuth({
        method: "CARD",
        successUrl: `${window.location.origin}/account/payment/callback?customerKey=${encodeURIComponent(customerKey)}`,
        failUrl: `${window.location.origin}/account/payment?error=${encodeURIComponent("카드 등록이 취소되었습니다.")}`,
      });
    } catch (error) {
      console.error("Error adding card:", error);
      const errorMessage = error instanceof Error ? error.message : "카드 등록 중 오류가 발생했습니다.";
      if (!errorMessage.includes("취소")) {
        setError(errorMessage);
      }
    } finally {
      setIsAddingCard(false);
    }
  };

  // 카드 삭제
  const handleDeleteCard = async (billingKey: string) => {
    if (!confirm(t("account.delete_card_confirm") || "이 카드를 삭제하시겠습니까?")) {
      return;
    }

    try {
      setDeletingId(billingKey);
      setError(null);

      const response = await fetch(`/api/payment-methods/${encodeURIComponent(billingKey)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccessMessage(t("account.card_deleted") || "카드가 삭제되었습니다.");
        await fetchPaymentMethods();
      } else {
        const data = await response.json();
        setError(data.error || "카드 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      setError("카드 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  // 카드사 이름 가져오기
  const getCardCompanyName = (issuerCode: string | null): string => {
    if (!issuerCode) return "카드";
    return cardCompanyNames[issuerCode] || issuerCode;
  };

  // 카드 종류 한글화
  const getCardTypeName = (cardType: string | null): string => {
    if (!cardType) return "";
    const typeMap: Record<string, string> = {
      "신용": "신용카드",
      "체크": "체크카드",
      "기프트": "기프트카드",
    };
    return typeMap[cardType] || cardType;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="animate-spin text-4xl text-theme-color" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("account.payment_methods") || "결제 수단"}</h1>
        <p className="text-gray-600">
          {t("account.manage_payment") || "등록된 결제 수단을 관리하세요"}
        </p>
      </div>

      {/* 성공 메시지 */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <FiCheck className="text-green-500 mr-3 flex-shrink-0" />
          <span className="text-green-700">{successMessage}</span>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <FiAlertCircle className="text-red-500 mr-3 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        {paymentMethods.length === 0 ? (
          /* 결제 수단 없음 */
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FiCreditCard className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("account.no_payment_methods") || "등록된 결제 수단이 없습니다"}
            </h3>
            <p className="text-gray-500 mb-6">
              카드를 등록하면 더 빠르게 결제할 수 있습니다.
            </p>
            <button
              onClick={handleAddCard}
              disabled={isAddingCard}
              className="inline-flex items-center px-6 py-3 bg-theme-color text-white rounded-lg hover:bg-theme-color/90 transition-colors disabled:opacity-50"
            >
              {isAddingCard ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  등록 중...
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" />
                  {t("account.add_card") || "카드 추가"}
                </>
              )}
            </button>
          </div>
        ) : (
          /* 결제 수단 목록 */
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* 카드 아이콘 */}
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
                    <FiCreditCard className="text-white" />
                  </div>

                  {/* 카드 정보 */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {getCardCompanyName(method.cardCompany)}
                      </span>
                      {method.cardType && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {getCardTypeName(method.cardType)}
                        </span>
                      )}
                      {method.isDefault && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">
                          기본
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {method.cardNumber || "•••• •••• •••• ****"}
                    </div>
                  </div>
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => handleDeleteCard(method.billingKey)}
                  disabled={deletingId === method.billingKey}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title={t("account.delete_card") || "카드 삭제"}
                >
                  {deletingId === method.billingKey ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiTrash2 />
                  )}
                </button>
              </div>
            ))}

            {/* 카드 추가 버튼 */}
            <button
              onClick={handleAddCard}
              disabled={isAddingCard}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-theme-color hover:text-theme-color transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isAddingCard ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  등록 중...
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" />
                  {t("account.add_card") || "카드 추가"}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
