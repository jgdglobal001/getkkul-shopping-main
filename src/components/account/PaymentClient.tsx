"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  FiCreditCard,
  FiLoader,
  FiCheck,
  FiAlertCircle,
  FiTrash2,
  FiPlus,
  FiX,
} from "react-icons/fi";
import {
  buildBrandpayCustomerIdentity,
  buildTossCustomerKey,
  getBrandpayRedirectUrl,
  persistExpectedBrandpayCustomerKey,
} from "@/lib/tossUtils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  TossPaymentsMethodWidget,
  TossPaymentsAgreementWidget,
  TossPaymentsWidgetsInstance,
  useTossPaymentsReady,
} from "@/hooks/useTossPayments";

/* ── Types ─────────────────────────────────────────────── */

interface BrandPayCard {
  id: string;
  methodKey: string;
  cardName: string;
  cardNumber: string;
  cardType: string;
  ownerType: string;
  issuerCode: string;
  iconUrl: string;
  cardImgUrl: string;
  registeredAt: string;
  status: string;
  color: { background: string; text: string };
}

interface BrandPayMethodsResponse {
  cards: BrandPayCard[];
  accounts: any[];
  isIdentified: boolean;
  selectedMethodId: string | null;
}

/* ── Component ─────────────────────────────────────────── */

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

  // ── State ──
  const [cards, setCards] = useState<BrandPayCard[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Widget modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const paymentWidgetRef = useRef<TossPaymentsWidgetsInstance | null>(null);
  const methodWidgetRef = useRef<TossPaymentsMethodWidget | null>(null);
  const agreementWidgetRef = useRef<TossPaymentsAgreementWidget | null>(null);

  const { isReady: tossReady, sdkError, tossPaymentsFactory } = useTossPaymentsReady();

  /* ── URL params handling ── */
  useEffect(() => {
    const bp = searchParams.get("brandpay");
    const bpError = searchParams.get("brandpayError");

    if (bp === "success") {
      setSuccessMessage("결제수단이 성공적으로 등록되었습니다.");
      router.replace("/account/payment");
      // Refresh card list after successful registration
      if (customerKey) fetchCards(customerKey);
    } else if (bpError) {
      setError(decodeURIComponent(bpError));
      router.replace("/account/payment");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /* ── Auto-dismiss messages ── */
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(t);
  }, [successMessage]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 8000);
    return () => clearTimeout(t);
  }, [error]);

  /* ── SDK error ── */
  useEffect(() => {
    if (status === "authenticated" && sdkError) setError(sdkError);
  }, [sdkError, status]);

  /* ── Fetch cards on mount ── */
  const fetchCards = useCallback(async (ck: string) => {
    try {
      setListLoading(true);
      const res = await fetch(`/api/toss/brandpay/methods?customerKey=${encodeURIComponent(ck)}`);
      const data: BrandPayMethodsResponse = await res.json();

      if (!res.ok) {
        throw new Error((data as any).error || "결제수단 조회에 실패했습니다.");
      }

      setCards(data.cards ?? []);
    } catch (err: any) {
      console.error("[PaymentClient] fetchCards error:", err);
      // 조회 실패는 빈 목록 표시 (최초 가입 전 등)
      setCards([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && customerKey) {
      fetchCards(customerKey);
    } else if (status !== "loading") {
      setListLoading(false);
    }
  }, [customerKey, fetchCards, status]);

  /* ── Delete card ── */
  const handleDeleteCard = async (card: BrandPayCard) => {
    if (!customerKey) return;

    const confirmed = window.confirm(`${card.cardName} (${card.cardNumber})을(를) 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      setDeleteLoading(card.methodKey);
      setError(null);

      const res = await fetch("/api/toss/brandpay/methods/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerKey, methodKey: card.methodKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "카드 삭제에 실패했습니다.");
      }

      setSuccessMessage(`${card.cardName}이(가) 삭제되었습니다.`);
      setCards((prev) => prev.filter((c) => c.methodKey !== card.methodKey));
    } catch (err: any) {
      console.error("[PaymentClient] deleteCard error:", err);
      setError(err.message || "카드 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleteLoading(null);
    }
  };

  /* ── Add card via widgets() modal ── */
  const openAddCardModal = useCallback(() => {
    if (!tossReady || !tossPaymentsFactory || !customerKey) {
      setError("결제 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // Persist expected customerKey for the BrandPay callback
    persistExpectedBrandpayCustomerKey(customerKey, brandpayReturnPath, {
      customerIdentity: brandpayCustomerIdentity,
    });

    setShowAddModal(true);
    setWidgetReady(false);
  }, [brandpayCustomerIdentity, brandpayReturnPath, customerKey, tossPaymentsFactory, tossReady]);

  /* ── Initialize widget when modal opens ── */
  useEffect(() => {
    if (!showAddModal || !tossReady || !tossPaymentsFactory || !customerKey) return;

    let isMounted = true;
    const tossClientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    if (!tossClientKey) return;

    const initWidget = async () => {
      try {
        const brandpayRedirectUrl = getBrandpayRedirectUrl(window.location.origin, brandpayReturnPath);
        const tossPayments = tossPaymentsFactory(tossClientKey);
        const pw = tossPayments.widgets({
          customerKey,
          brandpay: { redirectUrl: brandpayRedirectUrl },
        });

        paymentWidgetRef.current = pw;
        await pw.setAmount({ value: 100, currency: "KRW" });

        if (!isMounted) return;

        const methodWidget = await pw.renderPaymentMethods({
          selector: "#payment-method-add-widget",
          variantKey: process.env.NEXT_PUBLIC_TOSS_VARIANT_KEY || "DEFAULT",
        });
        methodWidgetRef.current = methodWidget;

        const agreeWidget = await pw.renderAgreement({
          selector: "#payment-agreement-add-widget",
          variantKey: "AGREEMENT",
        });
        agreementWidgetRef.current = agreeWidget;

        if (isMounted) setWidgetReady(true);
      } catch (err) {
        console.error("[PaymentClient] widget init error:", err);
        if (isMounted) setError("결제 위젯을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      }
    };

    // Small delay to let the modal DOM render
    const timerId = setTimeout(initWidget, 100);

    return () => {
      isMounted = false;
      clearTimeout(timerId);
      // Cleanup widgets
      const destroyWidget = async (w: { destroy?: () => void | Promise<void> } | null) => {
        try { if (w?.destroy) await w.destroy(); } catch { /* ignore */ }
      };
      destroyWidget(methodWidgetRef.current);
      destroyWidget(agreementWidgetRef.current);
      methodWidgetRef.current = null;
      agreementWidgetRef.current = null;
      paymentWidgetRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddModal, tossReady, customerKey]);

  const closeAddModal = () => {
    setShowAddModal(false);
    setWidgetReady(false);
    // Refresh card list after modal closes (may have registered a card)
    if (customerKey) fetchCards(customerKey);
  };

  /* ── Render ── */
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("account.payment_methods") || "결제 수단"}
        </h1>
        <p className="text-gray-600">
          안전하고 간편한 겟꿀페이로 결제 수단을 등록하고 관리하세요.
        </p>
      </div>

      {/* Messages */}
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

      {/* Card List */}
      <div className="bg-white rounded-lg shadow border border-gray-100">
        {/* Section header + Add button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <FiCreditCard className="text-xl text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">등록된 결제수단</h3>
              <p className="text-sm text-gray-500">겟꿀페이 (BrandPay)</p>
            </div>
          </div>
          <button
            onClick={openAddCardModal}
            disabled={!isAuthenticated || isLoading || !tossReady}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-theme-color text-white rounded-lg hover:bg-theme-color/90 transition-colors disabled:opacity-50 text-sm font-medium shadow-sm"
          >
            <FiPlus className="text-lg" />
            결제수단 추가
          </button>
        </div>

        {/* Card list body */}
        <div className="p-6">
          {listLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FiLoader className="animate-spin text-3xl text-blue-600 mb-3" />
              <p className="text-gray-500">결제수단을 불러오는 중...</p>
            </div>
          ) : cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiCreditCard className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-700 font-semibold mb-1">등록된 결제수단이 없습니다</p>
              <p className="text-sm text-gray-500 max-w-xs">
                결제수단을 추가하면, 결제 시 비밀번호 하나로 빠르게 결제할 수 있어요.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {cards.map((card) => (
                <li
                  key={card.methodKey}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Card icon */}
                    {card.iconUrl ? (
                      <img
                        src={card.iconUrl}
                        alt={card.cardName}
                        className="w-10 h-10 rounded-lg object-contain"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: card.color?.background || "#e5e7eb",
                          color: card.color?.text || "#374151",
                        }}
                      >
                        {card.cardName?.slice(0, 2) || "카드"}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{card.cardName}</p>
                      <p className="text-sm text-gray-500">
                        {card.cardNumber} · {card.cardType}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCard(card)}
                    disabled={deleteLoading === card.methodKey}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="결제수단 삭제"
                  >
                    {deleteLoading === card.methodKey ? (
                      <FiLoader className="animate-spin text-lg" />
                    ) : (
                      <FiTrash2 className="text-lg" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Add Card Modal (widgets) ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">결제수단 추가</h3>
              <button
                onClick={closeAddModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Widget area */}
            <div className="p-5">
              <p className="text-sm text-gray-500 mb-4">
                아래에서 브랜드페이를 선택하여 카드를 등록해주세요.
              </p>

              {/* Payment method widget */}
              <div id="payment-method-add-widget" className="mb-3">
                {!widgetReady && (
                  <div className="flex items-center justify-center py-16">
                    <FiLoader className="animate-spin text-blue-600 text-3xl" />
                  </div>
                )}
              </div>

              {/* Agreement widget */}
              <div id="payment-agreement-add-widget" className="mb-4" />

              <p className="text-xs text-gray-400 text-center">
                위젯에서 브랜드페이 카드를 등록하면 자동으로 결제수단이 추가됩니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
