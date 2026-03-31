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
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Widget modal
  const [showWidget, setShowWidget] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const paymentWidgetRef = useRef<TossPaymentsWidgetsInstance | null>(null);
  const methodWidgetRef = useRef<TossPaymentsMethodWidget | null>(null);
  const agreementWidgetRef = useRef<TossPaymentsAgreementWidget | null>(null);

  const { isReady: tossReady, sdkError, tossPaymentsFactory } = useTossPaymentsReady();

  /* ── URL params (BrandPay callback) ── */
  useEffect(() => {
    const bp = searchParams.get("brandpay");
    const bpError = searchParams.get("brandpayError");

    if (bp === "success") {
      setSuccessMessage("결제수단이 성공적으로 등록되었습니다.");
      router.replace("/account/payment");
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

  /* ── Open widget ── */
  const openWidget = useCallback(() => {
    if (!tossReady || !tossPaymentsFactory || !customerKey) {
      setError("결제 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // Persist expected customerKey for the BrandPay callback
    persistExpectedBrandpayCustomerKey(customerKey, brandpayReturnPath, {
      customerIdentity: brandpayCustomerIdentity,
    });

    setShowWidget(true);
    setWidgetReady(false);
  }, [brandpayCustomerIdentity, brandpayReturnPath, customerKey, tossPaymentsFactory, tossReady]);

  /* ── Initialize widget when opened ── */
  useEffect(() => {
    if (!showWidget || !tossReady || !tossPaymentsFactory || !customerKey) return;

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
          selector: "#brandpay-manage-widget",
          variantKey: process.env.NEXT_PUBLIC_TOSS_VARIANT_KEY || "DEFAULT",
        });
        methodWidgetRef.current = methodWidget;

        const agreeWidget = await pw.renderAgreement({
          selector: "#brandpay-agreement-widget",
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
  }, [showWidget, tossReady, customerKey]);

  const closeWidget = () => {
    setShowWidget(false);
    setWidgetReady(false);
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

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
          <FiCreditCard className="text-4xl text-blue-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3">
          겟꿀페이 간편결제 (BrandPay)
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
          결제수단을 등록해두면, 결제 시마다 카드번호를 입력할 필요 없이
          비밀번호 하나로 쉽고 빠르게 결제할 수 있습니다.
        </p>

        <button
          onClick={openWidget}
          disabled={!isAuthenticated || isLoading || !tossReady}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-theme-color text-white rounded-xl hover:bg-theme-color/90 transition-colors disabled:opacity-50 text-base font-medium shadow-md shadow-theme-color/20"
        >
          {isLoading ? (
            <FiLoader className="animate-spin text-xl" />
          ) : (
            <FiCreditCard className="text-xl" />
          )}
          결제수단 관리하기
        </button>

        <p className="text-xs text-gray-400 mt-4">
          카드 추가 · 삭제 · 비밀번호 변경을 한 곳에서 관리할 수 있어요.
        </p>
      </div>

      {/* ── Widget Modal ── */}
      {showWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">결제수단 관리</h3>
              <button
                onClick={closeWidget}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Widget area */}
            <div className="p-5">
              <div id="brandpay-manage-widget" className="mb-3">
                {!widgetReady && (
                  <div className="flex items-center justify-center py-16">
                    <FiLoader className="animate-spin text-blue-600 text-3xl" />
                  </div>
                )}
              </div>
              <div id="brandpay-agreement-widget" className="mb-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
