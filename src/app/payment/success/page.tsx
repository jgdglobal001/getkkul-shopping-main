"use client";

export const runtime = 'edge';

import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { resetCart } from "@/redux/shofySlice";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verificationAttempted = useRef(false);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const verifyPayment = useCallback(async () => {
    // Prevent duplicate verification
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    try {
      const response = await fetch("/api/orders/toss-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          paymentKey,
          amount: parseInt(amount || "0"),
          userEmail: session?.user?.email || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error response:", errorData);
        throw new Error(errorData.error || "Payment verification failed");
      }

      // Payment verified successfully - clear the cart!
      dispatch(resetCart());
      setVerified(true);
      setLoading(false);
    } catch (err) {
      console.error("Payment verification error:", err);
      setError(err instanceof Error ? err.message : "결제 확인 중 오류가 발생했습니다");
      setLoading(false);
    }
  }, [orderId, paymentKey, amount, session?.user?.email, dispatch]);

  useEffect(() => {
    // Wait for session to load, then verify payment
    if (sessionStatus === "loading") return;

    // Verify payment once we have the required params
    if (paymentKey && orderId && amount && !verificationAttempted.current) {
      verifyPayment();
    }
  }, [paymentKey, orderId, amount, sessionStatus, verifyPayment]);

  // Show loading while session is loading or payment is being verified
  if (sessionStatus === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">
            {sessionStatus === "loading" ? "로그인 확인 중..." : "결제를 확인 중입니다..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error if verification failed
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 확인 필요</h1>
          <p className="text-gray-600 mb-4">
            결제는 완료되었으나 확인 중 문제가 발생했습니다.
          </p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <div className="bg-gray-50 rounded p-4 mb-6 text-left">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">주문번호:</span> {orderId}
            </p>
          </div>
          <Link
            href="/account/orders"
            className="block w-full bg-primary text-white py-2 px-4 rounded font-semibold hover:bg-primary-dark transition"
          >
            주문 내역에서 확인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 완료</h1>
        <p className="text-gray-600 mb-4">주문이 성공적으로 완료되었습니다.</p>
        
        <div className="bg-gray-50 rounded p-4 mb-6 text-left">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">주문번호:</span> {orderId}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-semibold">결제금액:</span> ₩{parseInt(amount || "0").toLocaleString("ko-KR")}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/account/orders"
            className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition text-center"
          >
            📋 주문 내역 확인
          </Link>
          <Link
            href="/"
            className="block w-full bg-pink-400 text-white py-3 px-4 rounded-lg font-semibold hover:bg-pink-500 transition text-center"
          >
            🛒 계속 쇼핑하기
          </Link>
        </div>
      </div>
    </div>
  );
}