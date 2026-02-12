"use client";

export const runtime = 'edge';

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";
import { useEffect, useRef } from "react";

export default function PaymentFail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cleanupAttempted = useRef(false);

  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  // FIX 3: Clean up pending order on payment failure
  useEffect(() => {
    if (cleanupAttempted.current) return;
    cleanupAttempted.current = true;

    const cleanupPendingOrder = async () => {
      // Get orderId from URL or sessionStorage
      const pendingOrderId = orderId || (typeof window !== "undefined" ? sessionStorage.getItem("getkkul_pending_order") : null);

      if (pendingOrderId) {
        try {
          await fetch(`/api/orders/${pendingOrderId}/cancel-pending`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.warn("Failed to cancel pending order on fail page:", error);
        }
      }

      // Clear sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("getkkul_pending_order");
        sessionStorage.removeItem("getkkul_pending_amount");
      }
    };

    cleanupPendingOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 실패</h1>
        <p className="text-gray-600 mb-4">결제 처리 중 문제가 발생했습니다.</p>

        <div className="bg-red-50 rounded p-4 mb-6 text-left">
          {errorMessage && (
            <p className="text-sm text-red-600">
              <span className="font-semibold">오류:</span> {decodeURIComponent(errorMessage)}
            </p>
          )}
          {errorCode && (
            <p className="text-sm text-red-600 mt-2">
              <span className="font-semibold">코드:</span> {errorCode}
            </p>
          )}
          {orderId && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold">주문번호:</span> {orderId}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => router.back()}
            className="block w-full bg-primary text-white py-2 px-4 rounded font-semibold hover:bg-primary-dark transition"
          >
            결제 다시 시도
          </button>
          <Link
            href="/account/orders"
            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded font-semibold hover:bg-gray-300 transition"
          >
            주문 목록으로
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          문제가 계속되면 고객 지원팀에 문의하세요.
        </p>
      </div>
    </div>
  );
}